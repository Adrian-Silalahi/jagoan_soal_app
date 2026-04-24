"use client"

import { useState } from "react"
import toast from "react-hot-toast"

interface Option {
  key: string
  value: string
}

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

interface Props {
  question: Question
  index: number
  subject?: string
}

const OPTION_KEYS = ["A", "B", "C", "D", "E"]

const ItemQuestion = ({ question, index, subject = "" }: Props) => {
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // ── Normalise question text ──
  const questionText =
    question.soal || question.pertanyaan || question.question || ""

  // ── Normalise options → [{ key, value }] ──
  const options: Option[] = (() => {
    if (question.pilihan) {
      if (Array.isArray(question.pilihan)) {
        return question.pilihan.map((v, i) => ({
          key: OPTION_KEYS[i] ?? String(i + 1),
          value: v,
        }))
      }
      return Object.entries(question.pilihan).map(([k, v]) => ({
        key: k.toUpperCase(),
        value: v,
      }))
    }
    if (question.options) {
      return question.options.map((v, i) => ({
        key: OPTION_KEYS[i] ?? String(i + 1),
        value: v,
      }))
    }
    return []
  })()

  // Jangan toUpperCase — jawaban essay bisa teks panjang
  const correctAnswer = question.jawaban || question.answer || ""
  const pembahasan = question.pembahasan || question.explanation
  const isEssay = options.length === 0

  // ── Copy to clipboard ──
  const handleCopy = () => {
    const text = [
      `${index}. ${questionText}`,
      ...options.map((o) => `${o.key}. ${o.value}`),
      correctAnswer ? `\nJawaban: ${correctAnswer}` : "",
      pembahasan ? `Pembahasan: ${pembahasan}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success("Soal disalin!", { position: "bottom-center" })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Save to Bank Soal ──
  const handleSave = async () => {
    if (isSaving || isSaved) return

    // Validation
    if (!questionText) {
      toast.error("Soal tidak valid", { position: "bottom-center" })
      return
    }

    // Map options array → a, b, c, d, e fields
    // API expects individual fields, not an array
    const optionMap: Record<string, string | null> = {
      a: null,
      b: null,
      c: null,
      d: null,
      e: null,
    }
    options.forEach((opt) => {
      const key = opt.key.toLowerCase()
      if (key in optionMap) {
        optionMap[key] = opt.value
      }
    })

    setIsSaving(true)

    try {
      const res = await fetch("/api/questionbank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          a: optionMap.a,
          b: optionMap.b,
          c: optionMap.c,
          d: optionMap.d,
          e: optionMap.e,
          answer: correctAnswer,
          subject: subject,
        }),
      })

      if (!res.ok) {
        // 401 = belum login
        if (res.status === 401) {
          toast.error("Login terlebih dahulu untuk menyimpan soal", {
            position: "bottom-center",
          })
          return
        }
        throw new Error("Gagal menyimpan")
      }

      setIsSaved(true)
      toast.success("Soal disimpan ke Bank Soal!", {
        position: "bottom-center",
        icon: "📚",
      })
    } catch (err) {
      console.error(err)
      toast.error("Gagal menyimpan soal, coba lagi", {
        position: "bottom-center",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="glass-panel rounded-xl p-6 relative overflow-hidden group 
                    hover:bg-surface-container-high/30 transition-all duration-300 
                    animate-fade-in-up"
    >
      {/* Top edge highlight on hover */}
      <div
        className="absolute top-0 left-0 w-full h-[1px] 
                      bg-gradient-to-r from-transparent via-primary/50 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="flex items-start gap-4">
        {/* Question number badge */}
        <div
          className="w-10 h-10 rounded-lg bg-surface-container 
                        flex items-center justify-center 
                        text-primary font-display text-lg font-bold flex-shrink-0 
                        border border-white/5 group-hover:border-primary/30 transition-colors"
        >
          {index}
        </div>

        <div className="flex-1 min-w-0">
          {/* Question text */}
          <p className="text-on-surface text-base leading-relaxed mb-6">
            {questionText}
          </p>

          {/* Options */}
          {options.length > 0 && (
            <div className="flex flex-col gap-3 mb-6">
              {options.map((option) => {
                // Extract letter key dari answer jika format "C. 150 cm³"
                const answerUpper = correctAnswer.toUpperCase().trim()
                const answerLetter = answerUpper.match(/^([A-E])\./)?.[1] ?? ""
                const answerContent = answerUpper
                  .replace(/^[A-E]\.\s*/i, "")
                  .trim()
                const optionContent = option.value
                  .toUpperCase()
                  .replace(/^[A-E]\.\s*/i, "")
                  .trim()

                const isCorrect =
                  !!correctAnswer &&
                  // Match by letter key: "C" === "C"
                  ((answerLetter !== "" &&
                    option.key.toUpperCase() === answerLetter) ||
                    // Match by exact full value
                    option.value.toUpperCase().trim() === answerUpper ||
                    // Match by content tanpa prefix huruf (exact, bukan substring)
                    (optionContent !== "" && optionContent === answerContent))
                return isCorrect ? (
                  <div key={option.key} className="option-card-active">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                    <span
                      className="w-6 h-6 rounded-full bg-primary/20 text-primary 
                                    flex items-center justify-center text-xs font-bold flex-shrink-0"
                    >
                      {option.key}
                    </span>
                    <span className="text-on-surface text-sm font-medium">
                      {option.value}
                    </span>
                  </div>
                ) : (
                  <div key={option.key} className="option-card">
                    <span
                      className="w-6 h-6 rounded-full bg-surface-container-high text-outline 
                                    flex items-center justify-center text-xs font-bold flex-shrink-0"
                    >
                      {option.key}
                    </span>
                    <span className="text-on-surface-variant text-sm">
                      {option.value}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Jawaban untuk essay */}
          {isEssay && correctAnswer && (
            <div className="mb-6 p-4 rounded-lg bg-surface-container border border-outline-variant/30">
              <p className="text-xs font-semibold text-secondary mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  check_circle
                </span>
                Kunci Jawaban
              </p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {correctAnswer}
              </p>
            </div>
          )}

          {/* Penjelasan untuk pilihan ganda */}
          {!isEssay && pembahasan && (
            <div className="mb-6 p-4 rounded-lg bg-primary-container/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  lightbulb
                </span>
                Penjelasan
              </p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {pembahasan}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {/* Correct answer indicator */}
            {isEssay ? (
              <div className="flex items-center gap-2 text-secondary"></div>
            ) : (
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
                <span className="text-xs font-semibold">
                  {`Jawaban: ${correctAnswer
                    .replace(/^[A-E]\. /i, "")
                    .slice(0, 40)}${correctAnswer.length > 40 ? "..." : ""}`}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {/* Copy button */}
              <button
                onClick={handleCopy}
                title="Salin soal"
                className="p-2 rounded-lg text-outline hover:text-white 
                           hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? "check" : "content_copy"}
                </span>
              </button>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold 
                            border transition-all duration-200
                            ${
                              isSaved
                                ? // Saved state — green tint
                                  "bg-secondary/10 text-secondary border-secondary/30 cursor-default"
                                : isSaving
                                ? // Loading state
                                  "bg-surface-container text-outline border-white/10 cursor-wait"
                                : // Default
                                  "bg-surface-container text-primary hover:bg-primary-container hover:text-white border-white/10 hover:border-primary-container"
                            }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSaved
                    ? "check_circle"
                    : isSaving
                    ? "hourglass_top"
                    : "save"}
                </span>
                {isSaved ? "Tersimpan" : isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemQuestion
