import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

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

  const classificationResponse = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    stream: false,
    temperature: 0.2,
    max_tokens: 300,
    prompt: `klasifikasi text berikut : "${prompt}". hanya berikan jawaban dengan format json {"total":number,"subject":string,"grade":string,"topic":string}, jika tidak ada topik yang berarti beri nilai 'Umum'. jika tidak ada grade beri nilai 'Umum', jika ada grade pastikan menambahkan angkanya`,
  });

  const text = classificationResponse.choices[0]?.text;
  const {
    grade = "umum",
    subject = "umum",
    topic = "umum",
    total = 0,
    error = "",
  } = ClassifyInstruction(text ?? "{}");

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

  const generateQuiz = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    stream: true,
    temperature: 0.6,
    max_tokens: 1000,
    prompt: generateQuizPrompt,
  });

  const stream = OpenAIStream(generateQuiz);

  return new StreamingTextResponse(stream);
}
