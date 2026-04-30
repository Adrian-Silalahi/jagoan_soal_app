<div align="center">

# 🎓 JagoanSoal

### AI-powered question generator for Indonesian educators

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-jagoan--soal--app.vercel.app-6C5CE7?style=for-the-badge)](https://jagoan-soal-app.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_13-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## 📌 Overview

**JagoanSoal** adalah platform web yang membantu guru dan pendidik Indonesia membuat soal ujian berkualitas tinggi secara instan menggunakan kecerdasan buatan.

Cukup masukkan mata pelajaran, topik, kelas, dan jumlah soal — AI akan menghasilkan soal pilihan ganda atau essay yang sesuai dengan **Kurikulum Merdeka**, lengkap dengan kunci jawaban dan penjelasan, dalam hitungan detik.

---

## ✨ Features

- 🤖 **AI Question Generation** — Generate soal pilihan ganda (A–E) dan essay menggunakan LLaMA 3 via Groq
- 🎯 **Curriculum-Aware** — Soal dikalibrasi sesuai jenjang kelas (SD/SMP/SMA) dan Kurikulum Merdeka Indonesia
- 💡 **Answer Explanation** — Setiap soal pilihan ganda dilengkapi penjelasan mengapa jawaban itu benar
- 🗄️ **Bank Soal** — Simpan, kelola, dan cari soal yang pernah dibuat
- 📄 **Export to Word** — Export soal terpilih ke file `.docx` siap pakai
- 🔐 **Google Authentication** — Login cukup satu klik via Google OAuth
- 📱 **Responsive Design** — Tampil optimal di desktop maupun mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 13 (App Router + Pages Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **AI / LLM** | LLaMA 3.3 70B via [Groq](https://groq.com) |
| **Auth** | NextAuth.js (Google OAuth) |
| **Database** | MongoDB via Prisma ORM |
| **Deployment** | Vercel |
| **Export** | docx + file-saver |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com))
- Groq API key ([console.groq.com](https://console.groq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/Adrian-Silalahi/jagoan_soal_app.git
cd jagoan_soal_app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your credentials (see below)

# Push Prisma schema to your database
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI
GROQ_API_KEY="your-groq-api-key"
```

---

## 📁 Project Structure

```
jagoan_soal_app/
├── app/                    # Next.js App Router (layout, pages)
├── pages/api/              # API Routes (Pages Router)
│   ├── auth/               # NextAuth handler
│   ├── generate-question.ts # AI question generation endpoint
│   └── questionbank.ts     # CRUD for saved questions
├── components/
│   ├── home/               # Landing page sections
│   ├── navbar/             # Auth-aware navigation
│   ├── question/           # Question card components
│   └── ui/                 # Reusable UI primitives
├── views/                  # Page-level view components
├── utils/                  # Helpers (export-to-word, etc.)
└── prisma/                 # Database schema
```

---

## 👤 Author

**Adrianus Silalahi**

---

<div align="center">

Made with ❤️ — [Live Demo](https://jagoan-soal-app.vercel.app)

</div>
