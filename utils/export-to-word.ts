import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} from "docx"
import { saveAs } from "file-saver"

interface QuestionData {
  "Mata Pelajaran"?: string | null
  Soal: string
  Jawaban?: string | null
  "Pilihan A"?: string | null
  "Pilihan B"?: string | null
  "Pilihan C"?: string | null
  "Pilihan D"?: string | null
  "Pilihan E"?: string | null
}

const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const

export const exportToWord = (data: QuestionData[], fileName: string) => {
  const isMultipleChoice = data.some(
    (q) => q["Pilihan A"] || q["Pilihan B"]
  )

  const children: Paragraph[] = []

  // ── Cover heading ──
  children.push(
    new Paragraph({
      text: "Bank Soal",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  )

  if (data[0]?.["Mata Pelajaran"]) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Mata Pelajaran: ", bold: true }),
          new TextRun({ text: data[0]["Mata Pelajaran"] }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    )
  }

  // ── Questions ──
  data.forEach((q, idx) => {
    const num = idx + 1
    const options = [q["Pilihan A"], q["Pilihan B"], q["Pilihan C"], q["Pilihan D"], q["Pilihan E"]]
    const hasOptions = options.some(Boolean)

    // Question text
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${num}. `, bold: true }),
          new TextRun({ text: q.Soal }),
        ],
        spacing: { before: 300, after: 120 },
      })
    )

    // Options (if multiple choice)
    if (hasOptions) {
      options.forEach((opt, i) => {
        if (!opt) return
        const label = OPTION_LABELS[i]
        // Strip leading "A. " prefix if already in the text
        const cleanOpt = opt.replace(/^[A-E]\.\s*/i, "")
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `    ${label}. ${cleanOpt}` }),
            ],
            spacing: { after: 80 },
          })
        )
      })
    }

    // Answer line
    if (q.Jawaban) {
      const cleanAnswer = q.Jawaban.replace(/^[A-E]\.\s*/i, "")
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Jawaban: ", bold: true, color: "4F46E5" }),
            new TextRun({ text: cleanAnswer, color: "4F46E5" }),
          ],
          spacing: { before: 100, after: 200 },
        })
      )
    }

    // Divider between questions
    if (idx < data.length - 1) {
      children.push(
        new Paragraph({
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
          },
          spacing: { after: 100 },
          text: "",
        })
      )
    }
  })

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${fileName}.docx`)
  })
}
