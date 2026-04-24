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
    if (total > 20) {
      return res.status(400).json({ error: "Jumlah soal maksimal 20" })
    }

    let generateQuizPrompt = ""

    if (withOption) {
      generateQuizPrompt = `
Buatkan ${total} soal pilihan ganda untuk mata pelajaran ${subject}, kelas ${grade}, dengan topik: ${topic}.

ATURAN PENTING:
- Soal harus berupa pertanyaan atau pernyataan yang LANGSUNG bisa dijawab oleh siswa
- JANGAN menulis soal yang berisi instruksi seperti "jelaskan cara", "berikan contoh", "sebutkan langkah" — itu bukan soal pilihan ganda yang valid
- Gunakan format: pernyataan situasi / pertanyaan langsung → pilihan jawaban
- Contoh soal yang BENAR: "Sebuah persegi panjang memiliki panjang 8 cm dan lebar 5 cm. Berapakah luasnya?"
- Contoh soal yang SALAH: "Jelaskan cara menghitung luas persegi panjang dan berikan contohnya!"

Ketentuan tambahan:
- Sesuaikan kesulitan dengan tingkat kelas ${grade} (SD: konkret & sederhana; SMP: penalaran; SMA: analitis)
- Gunakan Bahasa Indonesia yang baku dan tidak ambigu
- Setiap soal memiliki 5 pilihan jawaban (A sampai E), hanya 1 benar
- Distraktor (pilihan salah) harus masuk akal dan tidak mudah ditebak
- Field "answer" berisi teks lengkap jawaban yang benar, sama persis dengan salah satu isi options
- Field "explanation" berisi 1-2 kalimat mengapa jawaban itu benar
- Variasikan level kognitif: C1 (hafalan), C2 (pemahaman), C3 (penerapan), C4 (analisis)

Format JSON:
{
  "questions": [
    {
      "question": "teks soal",
      "options": ["A. pilihan1", "B. pilihan2", "C. pilihan3", "D. pilihan4", "E. pilihan5"],
      "answer": "teks jawaban benar (persis sama dengan salah satu options)",
      "explanation": "penjelasan singkat"
    }
  ]
}
`
    } else {
      generateQuizPrompt = `
Buatkan ${total} soal essay untuk mata pelajaran ${subject}, kelas ${grade}, dengan topik: ${topic}.

ATURAN PENTING:
- Soal harus merupakan pertanyaan atau situasi yang LANGSUNG bisa dijawab oleh siswa
- JANGAN menulis soal yang berbunyikan instruksi kepada AI seperti "berikan contoh soal", "sebutkan macam-macam soal", atau "jelaskan cara membuat soal"
- Jika topik mengandung kata "soal cerita", artinya buat soal berbentuk narasi/cerita lalu ajukan pertanyaan kepada siswa (bukan minta AI membuat soal cerita)
- Contoh soal yang BENAR: "Sebuah toko menjual 240 buah apel. Jika 3/4 dari apel tersebut terjual pada hari pertama, berapa sisa apel yang belum terjual?"
- Contoh soal yang SALAH: "Berikan contoh soal cerita tentang pecahan dan jawabannya!"

Ketentuan tambahan:
- Sesuaikan kesulitan dan bahasa dengan tingkat kelas ${grade}
- Gunakan Bahasa Indonesia yang baku dan jelas
- Soal mendorong siswa berpikir, bukan sekadar menghafal
- Field "answer" berisi kunci jawaban komprehensif (3-5 kalimat), bukan 1 kata

Format JSON:
{
  "questions": [
    {
      "question": "teks soal",
      "answer": "kunci jawaban lengkap"
    }
  ]
}
`
    }

    const askGroq = async (content: string) => {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Kamu adalah seorang guru berpengalaman dan ahli pembuatan soal ujian di Indonesia. 
Kamu memahami Kurikulum Merdeka, standar kompetensi per jenjang pendidikan (SD, SMP, SMA), 
dan prinsip pembuatan soal yang baik sesuai kaidah penilaian pendidikan. 
Kamu selalu menghasilkan soal dalam Bahasa Indonesia yang baku, jelas, tidak ambigu, 
dan sesuai dengan perkembangan kognitif siswa sesuai kelasnya.
Kamu HANYA merespons dalam format JSON yang diminta, tanpa teks tambahan apapun.`,
          },
          { role: "user", content: content },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
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
