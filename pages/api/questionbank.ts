import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { prisma } from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // ── POST: simpan soal ──────────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const { question, a, b, c, d, e, answer, subject } = req.body

      const qb = await prisma.questionBank.create({
        data: {
          question,
          a,
          b,
          c,
          d,
          e,
          answer,
          subject,
          user: {
            connect: { email: session.user.email },
          },
        },
      })

      return res.status(200).json(qb)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error("[POST /api/questionbank]", message)
      return res.status(500).json({ message })
    }
  }

  // ── GET: ambil soal ────────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const query = (req.query.query as string) || ""
      const paramsPage = parseInt((req.query.page as string) || "1")
      const paramsLimit = 10

      const [qb, total] = await Promise.all([
        prisma.questionBank.findMany({
          where: {
            user: { email: session.user.email },
            question: { contains: query, mode: "insensitive" },
          },
          skip: (paramsPage - 1) * paramsLimit,
          take: paramsLimit,
        }),
        prisma.questionBank.count({
          where: {
            user: { email: session.user.email },
            question: { contains: query, mode: "insensitive" },
          },
        }),
      ])

      return res.status(200).json({
        questions: qb,
        pagination: {
          total,
          totalPage: Math.ceil(total / paramsLimit),
          currentPage: paramsPage,
        },
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error("[GET /api/questionbank]", message)
      return res.status(500).json({ message })
    }
  }

  // ── DELETE: hapus soal ─────────────────────────────────────────────────────
  if (req.method === "DELETE") {
    try {
      const { ids } = req.body

      const qb = await prisma.questionBank.deleteMany({
        where: {
          user: { email: session.user.email },
          id: { in: ids },
        },
      })

      return res.status(200).json(qb)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error("[DELETE /api/questionbank]", message)
      return res.status(500).json({ message })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}
