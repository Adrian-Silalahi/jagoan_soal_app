"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const SectionCTA = () => {
  const router = useRouter()

  return (
    <section className="py-[120px] relative px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative group rounded-2xl overflow-hidden">
          {/* Animated glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-secondary-container to-primary-container opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-xl" />

          <div className="relative glass-card p-12 md:p-20 text-center border-t border-white/20">
            {/* Radial mesh overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />

            <div className="relative z-10">
              <h2 className="font-outfit text-3xl sm:text-4xl md:text-headline-xl font-bold mb-6 text-white">
                Siap Mencoba?
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
                Bergabunglah dan rasakan kemudahan membuat soal cerdas dengan JagoanSoal.
              </p>
              <button
                onClick={() => router.push('/generate')}
                className="px-8 py-4 rounded-xl bg-on-surface text-surface text-body-lg font-bold hover:bg-white hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300"
              >
                Mulai Sekarang - Gratis
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionCTA
