import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

function ClassifyInstruction(classificationPrompt: string) {
  let Cgrade = "";
  let Csubject = "";
  let Ctopic = "";
  let Ctotal = 0;

  try {
    const { grade, subject, topic, total } = JSON.parse(classificationPrompt ?? "{}");
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

  const classificationPrompt = classificationResponse.choices[0]?.text;
  const {
    grade = "umum",
    subject = "umum",
    topic = "umum",
    total = 0,
    error = "",
  } = ClassifyInstruction(classificationPrompt ?? "{}");

  if (error) {
    return new Response(error, { status: 400 });
  }
  if (total > 10) {
    return new Response("Jumlah soal maksimal 10");
  }

  let generateQuizPrompt = "";

  if (withOption) {
    generateQuizPrompt = `Berikan soal pilihan ganda. berjumlah ${total} saja, untuk kelas ${grade} dengan mata pelajaran ${subject} dan topik ${topic}. pastikan hanya berikan soal dengan format berikut: gunakan json 'questions:[{question:"question",options:["A. answer","B. answer","C. answer","D. answer","E. answer"],answer:"answer"}]'. Pastikan anda memberikan options sebanyak 5 alias dari A - E`;
  } else {
    generateQuizPrompt = `Berikan soal essay berjumlah ${total} saja, untuk kelas ${grade} dengan mata pelajaran ${subject} dan topik ${topic}. pastikan hanya berikan soal dengan format berikut: gunakan json 'questions:[{question:"question",answer:"answer"}]' `;
  }

  const askOpenAi = async (content) => {
    const payload = {
      model: "gpt-3.5-turbo-0613",
      messages: [
        {
          role: "user",
          content: content
        },
      ],
      functions: [
        {
          name: "generate_soal_ujian",
          description:
            "Berikanlah soal ujian sesuai dengan content yang diberikan. Gunakan format JSON",
          parameters: {
            type: "object",
            properties: {
              question: {
                type: "string",
              },
              options: {
                type: "array",
                items : {
                  type: "string"
                }
              },
              answer: {
                type: "string",
              }
            },
            required: ["question", "answer"],
          },
        },
      ],
    };

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: content },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });
    const data = completion.choices[0].message.content
    console.log('data>>>>>>>>>>>>>>>>>>>>>>', data);
    return data
  };
  const questions: string | null = await askOpenAi(generateQuizPrompt)
  if (questions !== null) {
    const endQuestions = JSON.parse(questions)
    console.log('endQuestions', endQuestions);
    return NextResponse.json({data : endQuestions})
  }
  
}
