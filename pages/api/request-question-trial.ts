// import { getToken } from "next-auth/jwt";
// import { OpenAIStream, OpenAIStreamPayload } from "utils/OpenAiStream";

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("OPENAI_API_KEY is not defined")
// }

// export const config = {
//   runtime: 'edge',
// }

// const handler = async (req): Promise<Response> => {
//   if (req.method !== "POST") {
//     return new Response("Method not allowed", { status: 405 });
//   }

//   const token = await getToken({ req })

//   if (!token) {
//     return new Response("Unauthorized", { status: 401 });
//   }

  // const { subject, grade = "umum", have_options = false, topic = "", total = 5 } = (await req.json()) as {
  //   subject: string;
  //   grade: string;
  //   have_options: boolean;
  //   topic: string;
  //   total: number;
  // };

//   const main = `berikan ${total} soal ujian,`
//   const _subject = `untuk pelajaran ${subject},`
//   const _grade = `untuk ${grade.toLocaleLowerCase() === 'umum' ? 'umum' : `${grade}`}.`
//   const _topic = topic ? `dengan topik terkait: ${topic}.` : ''
//   const answer = `gunakan json ${have_options ? '[{question:"question",options:[],answer:"answear"}]' : '[{question:"question",answer:"answear"}]'}.`
//   const rules = `jangan tambahkan awalan angka pada setiap soal. ${have_options ? 'tambahkan awalan (a,b,c,d) pada setiap jawaban.' : ''}`
//   const language = `gunakan referensi kurikulum di Indonesia`

//   const content = `${main} ${_subject} ${_grade} ${_topic} ${answer} ${rules} ${language}`
//   console.log(content);
  
//   /**
//    * change model based on subject
//    */
//   // const model = subject.toLocaleLowerCase() === 'matematika' ? 'gpt-4' : 'gpt-3.5-turbo'
//   // const temperature = subject.toLocaleLowerCase() == 'matematika' ? 0.3 : 0.7
//   const model = 'gpt-3.5-turbo'
//   const temperature = 0.4

//   console.log({ content, model, temperature });

//   const payload: OpenAIStreamPayload = {
//     model: model,
//     messages: [
//       { role: "user", content }
//     ],
//     temperature: temperature,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     max_tokens: 300,
//     stream: true,
//     n: 1,
//   };

//   const stream = await OpenAIStream(payload);

//   return new Response(stream);
// }

// export default handler;
import OpenAI from "openai";
// import { env } from "@/env.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
// import { Ratelimit } from "@upstash/ratelimit";
// import { kv } from "@vercel/kv";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

export default async function POST(req: Request) {
  const { promptSubject, promptGrade = "umum", prompt_have_options , promptTopic = "", promptTotal = 5 } = (await req.json()) as {
    promptSubject: string;
    promptGrade: string;
    prompt_have_options: boolean;
    promptTopic: string;
    promptTotal: number;
  };
  const prompt = `${promptTotal} soal ${promptSubject}, kelas ${promptGrade}, dengan topik ${promptTopic},`
  const withOption = prompt_have_options


  console.log('withOption >>>>>>>>>>>>>>>', withOption);
  console.log('prompt', prompt);
  

  const classificationResponse = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    stream: false,
    temperature: 0.2,
    max_tokens: 300,
    prompt: `klasifikasi text berikut : "${prompt}". hanya berikan jawaban dengan format json {"total":number,"subject":string,"grade":string,"topic":string}, jika tidak ada topik yang berarti beri nilai 'Umum'. jika tidak ada grade beri nilai 'Umum', jika ada grade pastikan menambahkan angkanya`,
  });
  console.log("classificationResponse", classificationResponse);
  

  const text = classificationResponse.choices[0]?.text;
  console.log('text', text);
  

  const {
    grade = "umum",
    subject = "umum",
    topic = "umum",
    total = 0,
    error = "",
  } = ClassifyInstruction(text ?? "{}");

  console.log('grade', grade);
  console.log('subject', subject);
  console.log('topic', topic);
  console.log('total', total);
  console.log('error', error);

  if (error) {
    return new Response(error, { status: 400 });
  }
  if (total > 10) {
    return new Response("Jumlah soal maksimal 10");
  }

  let generateQuizPrompt = "";

  if (withOption) {
    generateQuizPrompt = `Berikan soal pilihan ganda. berjumlah ${total} saja, untuk ${grade} dengan mata pelajaran ${subject} dan topik ${topic}. pastikan hanya berikan soal dengan format berikut: gunakan json '[{question:"question",options:[],answer:"answer"}]' `;
  } else {
    generateQuizPrompt = `Berikan soal essay berjumlah ${total} saja, untuk ${grade} dengan mata pelajaran ${subject} dan topik ${topic}. pastikan hanya berikan soal dengan format berikut: gunakan json '[{question:"question",answer:"answer"}]' `;
  }

  console.log('generateQuizPrompt', generateQuizPrompt);
  

  const generateQuiz = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    stream: true,
    temperature: 0.6,
    max_tokens: 1000,
    prompt: generateQuizPrompt,
  });

  console.log("generateQuiz", generateQuiz);
  

  const stream = OpenAIStream(generateQuiz);

  console.log("stream", stream);
  

  return new StreamingTextResponse(stream);
}

function ClassifyInstruction(text: string) {
  let Cgrade = "";
  let Csubject = "";
  let Ctopic = "";
  let Ctotal = 0;

  try {
    const { grade, subject, topic, total } = JSON.parse(text ?? "{}");
    Cgrade = grade;
    Csubject = subject;
    Ctopic = topic;
    Ctotal = total;
  } catch (error) {
    return {
      error: "Gagal memproses instruksi, coba lagi",
    };
  }

  return {
    grade: Cgrade,
    subject: Csubject,
    topic: Ctopic,
    total: Ctotal,
  };
}
