"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import useDebounceValue from "@/hooks/use-debounce"
import { exportToWord } from "@/utils/export-to-word"
import { QuestionBank } from "@prisma/client"
import useSWR from "swr"

import { fetcher } from "@/lib/fetcher"
import { Dialog } from "@/components/dialog"
import LoadingItemQuestionBank from "@/components/loading/loading-item-questionbank"
import ItemQuestionBank from "@/components/question/item-question-bank"

type PaginationData = {
  questions: QuestionBank[]
  pagination: { totalPage: number; currentPage: number; limit: number }
}

const BankSoalView = () => {
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(20)
  const search = useSearchParams()
  const [select, setSelect] = useState<string[]>([])
  const [state, setState] = useState<"idle" | "onSelect">("onSelect")
  const [query, setQuery] = useState<string>(search?.get("query") || "")
  const [dialogOpen, setDialogOpen] = useState<"delete" | "">("")
  const router = useRouter()

  const queryDebounce = useDebounceValue(query, 500)
  const { data, isLoading, mutate } = useSWR<PaginationData>(
    `/api/questionbank?query=${
      search?.get("query") || ""
    }&page=${page}&limit=${limit}`,
    fetcher
  )

  useEffect(() => {
    if (queryDebounce) {
      router.push("/banksoal?query=" + queryDebounce)
    } else {
      router.push("/banksoal")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDebounce])

  const onExportClick = () => {
    if (select.length === 0) return
    const selectedQuestions = data?.questions
      .filter((q) => select.includes(q.id))
      .map((q) => ({
        "Mata Pelajaran": q.subject,
        Soal: q.question,
        Jawaban: q.answer,
        "Pilihan A": q.a,
        "Pilihan B": q.b,
        "Pilihan C": q.c,
        "Pilihan D": q.d,
        "Pilihan E": q.e,
      }))
    exportToWord(
      selectedQuestions || [],
      `jagoansoal-${new Date().toISOString()}`
    )
    setSelect([])
  }

  const onRemoveClick = () => {
    if (select.length === 0) return
    setDialogOpen("delete")
  }

  const onConfirmDelete = async () => {
    setDialogOpen("")
    await fetch("/api/questionbank", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: select }),
    })
      .then((res) => res.json())
      .catch((err) => console.error(err))
      .finally(() => {
        mutate()
        setSelect([])
      })
  }

  const toggleSelectAll = () => {
    if (!data?.questions) return
    if (select.length === data.questions.length) {
      setSelect([])
    } else {
      setSelect(data.questions.map((q) => q.id))
    }
  }

  const toggleItem = (id: string) => {
    setSelect((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const totalPages = data?.pagination.totalPage ?? 1
  const currentPage = data?.pagination.currentPage ?? 1

  const renderPageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <>
      {/* Background Orbs */}
      <div className="fixed top-40 left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-40 right-20 w-80 h-80 bg-secondary-container/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <Dialog
        isOpen={dialogOpen === "delete"}
        title="Yakin Hapus Soal?"
        onCancel={() => setDialogOpen("")}
        onConfirm={onConfirmDelete}
      />

      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="font-outfit text-4xl md:text-5xl font-black text-white mb-2">
              Bank Soal
            </h1>
            <p className="text-outline text-sm">
              Kelola dan temukan ribuan soal berkualitas tinggi.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary-container transition-colors">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari soal..."
                className="w-full bg-surface-container-lowest border border-surface-container-highest 
                           text-white rounded-lg pl-12 pr-4 py-3 
                           focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container 
                           transition-all placeholder:text-outline text-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="glass-panel rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-surface/50 text-outline text-xs uppercase tracking-wider">
                  <th className="py-5 px-6 font-medium w-14">
                    <input
                      type="checkbox"
                      className="checkbox-custom"
                      checked={
                        !!data?.questions.length &&
                        select.length === data.questions.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-5 px-4 font-medium w-14">#</th>
                  <th className="py-5 px-6 font-medium">Pertanyaan</th>
                  <th className="py-5 px-6 font-medium w-44">Jenis</th>
                  <th className="py-5 px-6 font-medium w-36">Mapel</th>
                  <th className="py-5 px-6 font-medium w-32 text-right">Tgl</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Loading state */}
                {isLoading &&
                  [...Array(5)].map((_, i) => (
                    <LoadingItemQuestionBank key={i} />
                  ))}

                {/* Empty state */}
                {!isLoading && !data?.questions.length && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-outline">
                      <span className="material-symbols-outlined text-4xl mb-3 block opacity-30">
                        inbox
                      </span>
                      Tidak ada soal ditemukan
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {data?.questions.map((item, index) => (
                  <ItemQuestionBank
                    key={item.id}
                    question={item}
                    index={(page - 1) * limit + (index + 1)}
                    iseSelected={select.includes(item.id)}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Pagination ── */}
        <div className="flex justify-between items-center px-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 text-outline hover:text-white transition-colors 
                       py-2 px-4 rounded-lg hover:bg-white/5 active:scale-95 
                       disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Prev
          </button>

          <div className="flex items-center gap-2">
            {renderPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="text-outline px-1">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all
                    ${
                      currentPage === p
                        ? "bg-primary-container text-white shadow-[0_0_15px_rgba(108,92,231,0.4)]"
                        : "text-outline hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 text-outline hover:text-white transition-colors 
                       py-2 px-4 rounded-lg hover:bg-white/5 active:scale-95 
                       disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            Next
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* ── Floating Action Bar (muncul saat ada item terpilih) ── */}
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 glass-panel px-6 py-4 rounded-full 
                    flex items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-40 
                    transition-all duration-300
                    ${
                      select.length > 0
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-6 pointer-events-none"
                    }`}
      >
        <span className="text-white font-medium text-sm">
          <span className="text-secondary-container">{select.length}</span> Soal
          Terpilih
        </span>
        <div className="w-px h-6 bg-white/20" />
        <div className="flex gap-3">
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 
                       px-4 py-2 rounded-full transition-all active:scale-95 
                       text-sm font-medium border border-white/10"
          >
            <span className="material-symbols-outlined text-sm">
              description
            </span>
            Export Word
          </button>
          <button
            onClick={onRemoveClick}
            className="flex items-center gap-2 text-white bg-error-container/20 
                       hover:bg-error-container/40 px-4 py-2 rounded-full transition-all 
                       active:scale-95 text-sm font-medium border border-error/20 
                       hover:border-error/50"
          >
            <span className="material-symbols-outlined text-sm text-error">
              delete
            </span>
            Hapus
          </button>
        </div>
      </div>
    </>
  )
}

export default BankSoalView
