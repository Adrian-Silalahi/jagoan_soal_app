import { QuestionBank } from "@prisma/client"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import "dayjs/locale/id"

dayjs.extend(relativeTime)
dayjs.locale("id")

interface Props {
  question: QuestionBank
  index: number
  iseSelected: boolean
  onToggle: () => void
}

const ItemQuestionBank = ({
  question,
  index,
  iseSelected,
  onToggle,
}: Props) => {
  const isPilihanGanda = question.a && question.b && question.c && question.d

  const formattedDate = question.createdAt
    ? dayjs(question.createdAt).format("DD MMM YY")
    : "-"

  return (
    <tr
      onClick={onToggle}
      className={`group transition-all duration-300 
        cursor-pointer
        ${iseSelected ? "bg-primary-container/10" : "hover:glow-hover"}
      `}
    >
      {/* Checkbox */}
      <td className="py-5 px-6">
        <input
          type="checkbox"
          className="checkbox-custom"
          checked={iseSelected}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
        />
      </td>

      {/* Number */}
      <td className="py-5 px-4 text-outline font-medium text-sm">
        {String(index).padStart(2, "0")}
      </td>

      {/* Question */}
      <td className="py-5 px-6">
        <p
          className={`font-medium line-clamp-1 transition-colors text-sm
            ${
              iseSelected
                ? "text-primary"
                : "text-white group-hover:text-secondary-container"
            }
          `}
        >
          {question.question}
        </p>
      </td>

      {/* Jenis badge */}
      <td className="py-5 px-6">
        {isPilihanGanda ? (
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                          bg-gradient-secondary text-white border border-white/10 
                          shadow-[0_0_10px_rgba(0,229,255,0.2)]"
          >
            Pilihan Ganda
          </span>
        ) : (
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                          bg-gradient-primary text-white border border-white/10 
                          shadow-[0_0_10px_rgba(108,92,231,0.2)]"
          >
            Essay
          </span>
        )}
      </td>

      {/* Mapel */}
      <td className="py-5 px-6 text-outline text-sm">{question.subject}</td>

      {/* Tanggal */}
      <td className="py-5 px-6 text-outline text-right text-sm">
        {formattedDate}
      </td>
    </tr>
  )
}

export default ItemQuestionBank
