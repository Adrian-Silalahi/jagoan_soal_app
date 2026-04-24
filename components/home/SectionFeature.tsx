"use client"

import React from "react"
import { motion } from "framer-motion"
import { Bot, Boxes, Database, Monitor, Shuffle, Timer } from "lucide-react"

interface FeatureItemProps {
  icon: React.ReactNode
  iconBgClass: string
  iconTextClass: string
  title: string
  description: string
}

const FeatureItem = ({
  icon,
  iconBgClass,
  iconTextClass,
  title,
  description,
}: FeatureItemProps) => {
  return (
    <div className="glass-card p-8 rounded-xl glass-hover transition-all duration-300 min-h-[270px]">
      <div
        className={`w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center mb-6 ${iconTextClass}`}
      >
        {icon}
      </div>
      <h3 className="font-outfit text-xl font-semibold mb-3 text-white">
        {title}
      </h3>
      <p className="text-body-md text-on-surface-variant">{description}</p>
    </div>
  )
}

const features = [
  {
    icon: <Timer className="w-6 h-6" />,
    iconBgClass: "bg-primary-container/20",
    iconTextClass: "text-primary",
    title: "Hemat Waktu",
    description:
      "Kurangi waktu penyusunan soal dari berjam-jam menjadi hanya beberapa detik saja.",
  },
  {
    icon: <Boxes className="w-6 h-6" />,
    iconBgClass: "bg-secondary-container/20",
    iconTextClass: "text-secondary-container",
    title: "Multi Topik",
    description:
      "Dukung berbagai mata pelajaran mulai dari eksakta hingga humaniora secara akurat.",
  },
  {
    icon: <Database className="w-6 h-6" />,
    iconBgClass: "bg-tertiary-container/20",
    iconTextClass: "text-tertiary",
    title: "Bank Soal",
    description:
      "Simpan dan organisir ribuan soal yang telah digenerate dalam satu tempat aman.",
  },
  {
    icon: <Shuffle className="w-6 h-6" />,
    iconBgClass: "bg-error-container/20",
    iconTextClass: "text-error",
    title: "Variasi Soal",
    description: "Hasilkan soal Pilihan Ganda dan Essay dengan mudah.",
  },
  {
    icon: <Monitor className="w-6 h-6" />,
    iconBgClass: "bg-primary-container/20",
    iconTextClass: "text-primary-container",
    title: "Responsive",
    description:
      "Akses platform dari perangkat apa saja, PC, tablet, maupun smartphone tanpa kendala.",
  },
  {
    icon: <Bot className="w-6 h-6" />,
    iconBgClass: "bg-secondary-container/20",
    iconTextClass: "text-secondary",
    title: "AI Powered",
    description:
      "Memanfaatkan teknologi LLM terbaru untuk memastikan kualitas dan relevansi soal tingkat tinggi.",
  },
]

const SectionFeature = () => {
  return (
    <section
      className="py-[120px] bg-surface/50 border-t border-white/5 relative"
      id="fitur"
    >
      {/* Subtle ambient glow */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-primary-container/5 rounded-l-full blur-[150px] -z-10" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-headline-xl font-bold mb-4 text-white">
            Kenapa <span className="text-primary">Jagoan Soal?</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Platform all-in-one untuk kebutuhan pembuatan soal evaluasi modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureItem {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SectionFeature
