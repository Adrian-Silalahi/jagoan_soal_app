import type { NextApiRequest, NextApiResponse } from "next"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
})

function ClassifyInstruction(classificationPrompt: string) {
  let Cgrade = ""
  let Csubject = ""
  let Ctopic = ""
  let Ctotal = 0

  try {
    const { grade, subject, topic, total } = JSON.parse(
      classificationPrompt ?? "{}"
    )
    Cgrade = grade
    Csubject = subject
    Ctopic = topic
    Ctotal = total
  } catch (error) {
    return {
      error: "Gagal memproses instruksi, coba lagi",
    }
  }

  return {
    grade: Cgrade,
    subject: Csubject,
    topic: Ctopic,
    total: Ctotal,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const {
      promptSubject,
      promptGrade = "umum",
      prompt_have_options,
      promptTopic = "",
      promptTotal = 5,
    } = req.body as {
      promptSubject: string
      promptGrade: string
      prompt_have_options: boolean
      promptTopic: string
      promptTotal: number
    }

    const prompt = `${promptTotal} soal ${promptSubject}, kelas ${promptGrade}, dengan topik ${promptTopic},`
    const withOption = prompt_have_options

    const classificationResponse = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: `klasifikasi text berikut : "${prompt}". hanya berikan jawaban dengan format json {"total":number,"subject":string,"grade":string,"topic":string}, jika tidak ada topik yang berarti beri nilai 'Umum'. jika tidak ada grade beri nilai 'Umum', jika ada grade pastikan menambahkan angkanya`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const classificationPrompt =
      classificationResponse.choices[0]?.message.content

    const {
      grade = "umum",
      subject = "umum",
      topic = "umum",
      total = 0,
      error = "",
    } = ClassifyInstruction(classificationPrompt ?? "{}")

    if (error) {
      return res.status(400).json({ error })
    }
    if (total > 10) {
      return res.status(400).json({ error: "Jumlah soal maksimal 10" })
    }

    let generateQuizPrompt = ""

    if (withOption) {
      generateQuizPrompt = `Berikan soal pilihan ganda. berjumlah ${total} saja, untuk kelas ${grade} dengan mata pelajaran ${subject} dan topik ${topic}. pastikan hanya berikan soal dengan format berikut: gunakan json 'questions:[{question:"question",options:["A. answer","B. answer","C. answer","D. answer","E. answer"],answer:"answer"}]'. Pastikan anda memberikan options sebanyak 5 alias dari A - E`
    } else {
      generateQuizPrompt = `Berikan soal essay berjumlah ${total} saja, untuk kelas ${grade} dengan mata pelajaran ${subject} dan topik ${topic}. pastikan hanya berikan soal dengan format berikut: gunakan json 'questions:[{question:"question",answer:"answer"}]' `
    }

    const askGroq = async (content: string) => {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
          { role: "user", content: content },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      })
      return completion.choices[0].message.content
    }

    const questions = await askGroq(generateQuizPrompt)
    if (questions !== null) {
      const endQuestions = JSON.parse(questions!)
      return res.status(200).json({ data: endQuestions })
    }

    return res.status(500).json({ error: "Gagal menghasilkan soal" })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan"
    console.error("[generate-question error]", message)
    return res.status(500).json({ error: message })
  }
}
