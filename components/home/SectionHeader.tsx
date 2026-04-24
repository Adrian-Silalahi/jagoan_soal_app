"use client"
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Wand2, PlayCircle, Zap } from 'lucide-react'
import React, { useState } from 'react'
import LoginModal from './LoginModal'

const SectionHeader = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [loginOpen, setLoginOpen] = useState(false)

  const handlePrimaryAction = () => {
    if (session?.user) {
      router.push('/generate')
    } else {
      setLoginOpen(true)
    }
  }

  return (
    <>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      <section className="relative pt-40 pb-[120px] flex items-center justify-center min-h-[90vh] overflow-hidden">

        {/* ── Gradient Orbs ── */}

        {/* Orb 1 — violet, top-left, slow pulse */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-20%', left: '-15%',
            width: '700px', height: '700px',
            background: 'radial-gradient(circle, rgba(108,92,231,0.45) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'orbFloat1 8s ease-in-out infinite',
          }}
        />

        {/* Orb 2 — cyan, bottom-right, offset timing */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-25%', right: '-10%',
            width: '650px', height: '650px',
            background: 'radial-gradient(circle, rgba(0,229,255,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(90px)',
            animation: 'orbFloat2 10s ease-in-out infinite',
          }}
        />

        {/* Orb 3 — fuchsia, center-right, medium */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '10%', right: '5%',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(70px)',
            animation: 'orbFloat1 12s ease-in-out infinite reverse',
          }}
        />

        {/* Orb 4 — small sharp violet, top center */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '15%', left: '40%',
            width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 60%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'orbFloat2 7s ease-in-out infinite',
          }}
        />

        {/* Orb 5 — warm amber tint, bottom-left subtle */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '0%', left: '10%',
            width: '350px', height: '350px',
            background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'orbFloat1 14s ease-in-out infinite 2s',
          }}
        />

        {/* Subtle dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0A0A0F, transparent)' }}
        />

        {/* Keyframes injected via style tag */}
        <style>{`
          @keyframes orbFloat1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33%       { transform: translate(30px, -20px) scale(1.05); }
            66%       { transform: translate(-20px, 15px) scale(0.97); }
          }
          @keyframes orbFloat2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            40%       { transform: translate(-25px, 20px) scale(1.04); }
            70%       { transform: translate(15px, -10px) scale(0.98); }
          }
        `}</style>

        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card px-4 py-2 rounded-full inline-flex items-center gap-2 mb-8 border-primary/30"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-subtle-sm text-primary">Powered by Groq · LLaMA 3</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-4xl sm:text-5xl md:text-6xl lg:text-hero-display font-extrabold max-w-4xl mx-auto mb-8 text-white"
          >
            Bikin Soal dalam <br className="hidden md:block" />
            <span className="text-gradient">Hitungan Detik, Bukan Jam.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12"
          >
            Tinggalkan cara manual. Generate soal berkualitas tinggi dari berbagai topik pelajaran dengan kekuatan AI. Siap untuk diekspor dan digunakan langsung.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <button
              onClick={handlePrimaryAction}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container text-body-lg font-medium hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(108,92,231,0.4)] transition-all duration-300 flex items-center gap-2"
            >
              <span>{session?.user ? "Buka App" : "Mulai Generate"}</span>
              <Wand2 className="w-5 h-5" />
            </button>
            <a
              href="#demo"
              className="px-8 py-4 rounded-xl glass-card text-on-surface text-body-lg font-medium hover:bg-surface-container-high transition-colors flex items-center gap-2"
            >
              <span>Lihat Demo</span>
              <PlayCircle className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default SectionHeader