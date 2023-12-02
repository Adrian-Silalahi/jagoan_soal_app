import Navbar from "@/components/navbar/navbar"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import Toaster from "@/components/toaster";
import Footer from "@/components/footer/footer";

export const metadata = {
  title: 'JagoanSoal - Generate Soal Online',
  description: 'JagoanSoal adalah platform untuk membuat soal secara online. Dengan fitur yang lengkap, membuat soal menjadi lebih mudah dan menyenangkan.',
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
    "Soal Ujian Sekolah Dasar",
    "Soal Ujian Sekolah Menengah Pertama",
    "Soal Ujian Sekolah Menengah Atas",
    "Soal Ujian Sekolah Menengah Kejuruan",
    "Soal Ujian Sekolah Menengah Kejuruan",
    "Soal Ujian Sekolah Menengah Kejuruan",
    "Soal Ujian Sekolah Menengah Kejuruan",
  ],
  authors: [
    {
      name: "adrianus silalahi",
    }
  ],
  creator: "adrianus silalahi",
}

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={cn('dark:bg-[#0c0c0c] dark:text-white', inter.className)}>
        <Navbar />
        <main className="mt-24">
          {children}
          <Analytics />
          <Toaster />
        </main>
        <Footer />
      </body>
    </html>
  )
}
