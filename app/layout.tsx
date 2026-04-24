import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar/navbar"
import "@/styles/globals.css"
import { Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

import Footer from "@/components/footer/footer"
import Toaster from "@/components/toaster"

export const metadata = {
  title: "JagoanSoal - AI Question Generator",
  description:
    "JagoanSoal adalah platform AI untuk membuat soal secara online. Generate soal berkualitas tinggi dalam hitungan detik dari berbagai mata pelajaran.",
  keywords: [
    "AI",
    "ChatGPT",
    "Chatbot",
    "Soal",
    "Soal Online",
    "Soal Ujian",
    "Soal Tryout",
    "Soal Ujian Nasional",
    "Soal UN",
    "Soal Ujian Sekolah",
  ],
  authors: [{ name: "adrianus silalahi" }],
  creator: "adrianus silalahi",
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ✅ Ubah "light" → "dark" agar Electric Midnight theme aktif
    <html lang="en" className="dark">
      <head>
        {/* ✅ Material Symbols — dibutuhkan untuk ikon di design baru */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "bg-background text-on-surface min-h-screen flex flex-col",
          inter.variable,
          outfit.variable,
          inter.className
        )}
      >
        <Navbar />
        <main className="mt-24 flex-1">
          {children}
          <Analytics />
          <Toaster />
        </main>
        <Footer />
      </body>
    </html>
  )
}
