"use client"

import React from "react"
import { motion } from "framer-motion"

const techStack = [
  { name: "Next.js", hoverClass: "hover:border-white/30 hover:bg-white/5" },
  { name: "Prisma", hoverClass: "hover:border-white/30 hover:bg-white/5" },
  {
    name: "Groq",
    hoverClass:
      "hover:border-primary/50 hover:bg-primary/10 hover:text-primary",
  },
  { name: "NextAuth", hoverClass: "hover:border-white/30 hover:bg-white/5" },
  {
    name: "Tailwind",
    hoverClass:
      "hover:border-secondary-container/50 hover:bg-secondary-container/10 hover:text-secondary-container",
  },
  {
    name: "Framer",
    hoverClass:
      "hover:border-tertiary/50 hover:bg-tertiary/10 hover:text-tertiary",
  },
  { name: "MongoDB", hoverClass: "hover:border-white/30 hover:bg-white/5" },
]

const SectionTechStack = () => {
  return (
    <section className="py-[120px] relative" id="tech-stack">
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <h2 className="font-outfit text-3xl sm:text-4xl md:text-headline-xl font-bold mb-12 text-white">
          Dibangun dengan <br />
          <span className="text-gradient">Teknologi Modern</span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
        >
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className={`glass-card px-6 py-3 rounded-full flex items-center gap-2 transition-all cursor-default text-on-surface font-medium ${tech.hoverClass}`}
            >
              <span>{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default SectionTechStack
