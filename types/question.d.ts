// type Question = {
//     question: string;
//     options: string[];
//     answer: string;
// }

interface Question {
  soal?: string
  pertanyaan?: string
  question?: string
  pilihan?: Record<string, string> | string[]
  options?: string[]
  jawaban?: string
  answer?: string
  pembahasan?: string
  explanation?: string
}
