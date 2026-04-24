"use client"

import React from "react"

const SectionVideo = () => {
  return (
    <section className="py-[120px] relative" id="demo">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-headline-xl font-bold mb-4 text-white">
            Lihat Bagaimana AI{" "}
            <span className="text-primary">Menggenerate Soal</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Interface sederhana, hasil luar biasa. Tonton demonstrasi singkat
            cara kerjanya.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative group">
          {/* Glow behind video */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-container to-secondary-container rounded-[20px] blur opacity-30 group-hover:opacity-50 transition duration-1000" />

          <div className="glass-card rounded-[16px] overflow-hidden relative">
            {/* Browser Chrome Header */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-surface-container/50">
              <div className="w-3 h-3 rounded-full bg-[#ffb4ab]" />
              <div className="w-3 h-3 rounded-full bg-[#ffb77d]" />
              <div className="w-3 h-3 rounded-full bg-[#a5e7ff]" />
              <div className="mx-auto px-4 py-1 rounded bg-surface-container-high text-xs text-on-surface-variant font-mono">
                app.jagoansoal.com
              </div>
            </div>

            {/* Video */}
            <div className="aspect-video bg-surface-container-lowest relative">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                {/* <source src="/demo.mp4" type="video/mp4" /> */}
                <source
                  src="https://github.com/Adrian-Silalahi/jagoan_soal_app/releases/download/v1.0/Video.Project.4.2.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionVideo
