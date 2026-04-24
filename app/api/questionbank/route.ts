import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/db"

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = JSON.parse(await req.text())
    const { question, a, b, c, d, e, answer, subject } = body

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

    return NextResponse.json(qb)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[POST /api/questionbank]", message)
    return NextResponse.json({ message }, { status: 500 })
  }
}

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const query = url.searchParams.get("query") || ""
    const paramsPage = parseInt(url.searchParams.get("page") || "1")
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

    return NextResponse.json({
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
    return NextResponse.json({ message }, { status: 500 })
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = JSON.parse(await req.text())
    const { ids } = body

    const qb = await prisma.questionBank.deleteMany({
      where: {
        user: { email: session.user.email },
        id: { in: ids },
      },
    })

    return NextResponse.json(qb)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[DELETE /api/questionbank]", message)
    return NextResponse.json({ message }, { status: 500 })
  }
}
