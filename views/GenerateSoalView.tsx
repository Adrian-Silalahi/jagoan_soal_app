"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Session } from "next-auth"
import toast from "react-hot-toast"

import LoadingItemQuestion from "@/components/loading/loading-item-question"
import ItemQuestion from "@/components/question/item-question"

interface Props {
  session: Session | null
}

const MATA_PELAJARAN = [
  "Matematika",
  "IPA",
  "IPS",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Fisika",
  "Kimia",
  "Biologi",
  "Sejarah",
  "Geografi",
  "Ekonomi",
  "Sosiologi",
  "PKN",
  "Seni Budaya",
  "Pendidikan Jasmani",
  "Agama Islam",
  "Agama Kristen",
]

const GRADE_OPTIONS = [
  { value: "umum", label: "Umum" },
  { value: "1 SD", label: "Kelas 1 SD" },
  { value: "2 SD", label: "Kelas 2 SD" },
  { value: "3 SD", label: "Kelas 3 SD" },
  { value: "4 SD", label: "Kelas 4 SD" },
  { value: "5 SD", label: "Kelas 5 SD" },
  { value: "6 SD", label: "Kelas 6 SD" },
  { value: "7 SMP", label: "Kelas 7 SMP" },
  { value: "8 SMP", label: "Kelas 8 SMP" },
  { value: "9 SMP", label: "Kelas 9 SMP" },
  { value: "10 SMA", label: "Kelas 10 SMA" },
  { value: "11 SMA", label: "Kelas 11 SMA" },
  { value: "12 SMA", label: "Kelas 12 SMA" },
]

const SUGGESTIONS = [
  {
    icon: "science",
    iconColor: "text-secondary-container",
    iconBg: "bg-secondary-container/20",
    subject: "IPA Terpadu",
    subject_value: "IPA",
    prompt: '"Buat 5 soal pilihan ganda tentang proses fotosintesis kelas 8"',
    topic: "Fotosintesis",
    grade: "8 SMP",
  },
  {
    icon: "calculate",
    iconColor: "text-tertiary",
    iconBg: "bg-tertiary-container/20",
    subject: "Matematika",
    subject_value: "Matematika",
    prompt: '"Latihan soal pecahan campuran untuk anak SD"',
    topic: "Pecahan Campuran",
    grade: "5 SD",
  },
  {
    icon: "history_edu",
    iconColor: "text-error",
    iconBg: "bg-error/20",
    subject: "Sejarah",
    subject_value: "Sejarah",
    prompt: '"Soal essay tentang proklamasi kemerdekaan Indonesia"',
    topic: "Proklamasi Kemerdekaan",
    grade: "11 SMA",
  },
]

const GenerateSoalView = ({ session }: Props) => {
  const router = useRouter()
  const [subject, setSubject] = useState<string>("")
  const [grade, setGrade] = useState<string>("umum")
  const [haveOptions, setHaveOptions] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [topic, setTopic] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(5)
  const [isInitial, setIsInitial] = useState(true)

  const resultsRef = useRef<HTMLDivElement>(null)

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const onSubmit = async () => {
    if (!session?.user) {
      router.push("/api/auth/signin")
      return
    }
    if (!subject) {
      toast.error("Pilih mata pelajaran terlebih dahulu", {
        position: "bottom-center",
      })
      return
    }
    if (!topic) {
      toast.error("Masukkan topik soal", { position: "bottom-center" })
      return
    }

    setIsInitial(false)
    await generate()
  }

  const generate = async () => {
    setIsLoading(true)
    setQuestions([])

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptSubject: subject,
          promptGrade: grade,
          prompt_have_options: haveOptions,
          promptTopic: topic,
          promptTotal: total,
        }),
      })

      const response = await res.json()

      if (!response?.data?.questions) {
        toast.error("Terjadi kesalahan, coba lagi", {
          position: "bottom-center",
        })
        setIsLoading(false)
        return
      }

      setQuestions(response.data.questions)
      setTimeout(scrollToResults, 100)
    } catch (error) {
      console.error(error)
      toast.error("Response lambat, silahkan coba lagi", {
        position: "bottom-center",
      })
    }

    setIsLoading(false)
  }

  const applySuggestion = (s: (typeof SUGGESTIONS)[0]) => {
    setSubject(s.subject_value)
    setTopic(s.topic)
    setGrade(s.grade)
    setTotal(5)
  }

  return (
    <>
      {/* ── Background Orbs ── */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary-container/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary-container/10 blur-[150px] pointer-events-none z-0" />

      {/* ── Main Layout ── */}
      <main className="relative z-10 px-4 md:px-8 pb-12 max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8 min-h-screen pt-8">
        {/* ─────────── LEFT SIDEBAR ─────────── */}
        <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] lg:sticky lg:top-8">
            {/* Header */}
            <header className="border-b border-white/10 pb-4">
              <h1 className="font-display text-2xl font-bold text-on-surface flex items-center gap-2">
                <span>✨</span> Generate Soal
              </h1>
            </header>

            {/* Form */}
            <div className="flex flex-col gap-5">
              {/* Mata Pelajaran */}
              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant text-sm font-medium">
                  Mata Pelajaran
                </label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-surface-container border border-outline-variant 
                               rounded-lg py-3 px-4 pr-10 text-on-surface appearance-none 
                               focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary 
                               transition-all disabled:opacity-50 text-sm"
                  >
                    <option value="">Pilih mata pelajaran</option>
                    {MATA_PELAJARAN.map((mp) => (
                      <option key={mp} value={mp}>
                        {mp}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Topik */}
              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant text-sm font-medium">
                  Topik
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  placeholder="Ketik topik detail atau paste materi disini..."
                  className="w-full bg-surface-container border border-outline-variant 
                             rounded-lg py-3 px-4 text-on-surface placeholder:text-outline 
                             focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary 
                             transition-all resize-none disabled:opacity-50 text-sm"
                />
                <span className="text-xs text-outline">
                  Kamu bisa memasukkan lebih dari satu topik.
                </span>
              </div>

              {/* Kelas & Jenis */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant text-sm font-medium">
                    Kelas
                  </label>
                  <div className="relative">
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-surface-container border border-outline-variant 
                                 rounded-lg py-3 px-3 pr-8 text-on-surface appearance-none 
                                 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary 
                                 transition-all disabled:opacity-50 text-sm"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-lg">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-on-surface-variant text-sm font-medium">
                    Jenis
                  </label>
                  <div className="relative">
                    <select
                      value={haveOptions ? "pg" : "essay"}
                      onChange={(e) => setHaveOptions(e.target.value === "pg")}
                      disabled={isLoading}
                      className="w-full bg-surface-container border border-outline-variant 
                                 rounded-lg py-3 px-3 pr-8 text-on-surface appearance-none 
                                 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary 
                                 transition-all disabled:opacity-50 text-sm"
                    >
                      <option value="pg">Pilihan Ganda</option>
                      <option value="essay">Essay</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-lg">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Jumlah Soal Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-on-surface-variant text-sm font-medium">
                    Jumlah Soal
                  </label>
                  <span className="bg-surface-container-high px-2.5 py-1 rounded-md text-primary text-xs font-bold">
                    {total}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                  disabled={isLoading}
                  className="w-full disabled:opacity-50"
                />
                <div className="flex justify-between text-xs text-outline">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-white/10 mt-auto">
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="btn-generate w-full py-4 px-6 rounded-xl text-white 
                           font-display text-lg font-bold 
                           flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isLoading ? "hourglass_top" : "auto_awesome"}
                </span>
                {isLoading ? "Sedang Generate..." : "Generate Soal"}
              </button>
            </div>
          </div>
        </aside>

        {/* ─────────── RIGHT CONTENT ─────────── */}
        <section className="flex-1 flex flex-col gap-8 min-w-0">
          {/* Suggestions (initial state) */}
          <AnimatePresence>
            {isInitial && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-on-surface-variant text-base">
                  Mulai generate soal pertamamu
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.subject}
                      onClick={() => applySuggestion(s)}
                      className="glass-panel p-4 rounded-xl cursor-pointer 
                                 hover:bg-white/5 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center ${s.iconColor}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {s.icon}
                          </span>
                        </div>
                        <span className="text-on-surface font-semibold text-sm">
                          {s.subject}
                        </span>
                      </div>
                      <p className="text-outline-variant group-hover:text-outline transition-colors text-xs leading-relaxed">
                        {s.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider — only when we have something below */}
          {(!isInitial || isLoading || questions.length > 0) && (
            <div className="flex items-center gap-4" ref={resultsRef}>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-xs text-outline uppercase tracking-widest font-semibold">
                Hasil Generate
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="flex flex-col gap-6">
              <div className="text-center text-on-surface-variant text-base py-2 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-primary animate-spin text-xl">
                  progress_activity
                </span>
                Sedang generate, mohon ditunggu...
              </div>
              {[...Array(3)].map((_, i) => (
                <LoadingItemQuestion key={i} />
              ))}
            </div>
          )}

          {/* Question cards */}
          {!isLoading && questions.length > 0 && (
            <div className="flex flex-col gap-6 pb-12">
              {questions.map((question, index) => (
                <ItemQuestion
                  key={index}
                  index={index + 1}
                  subject={subject}
                  question={question}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default GenerateSoalView
