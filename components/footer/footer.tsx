"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap } from "lucide-react"

const Footer = () => {
  const pathName = usePathname()

  if (pathName === "/login") return null

  // Landing page footer
  if (pathName === "/") {
    return (
      <footer className="bg-[#0A0A0F] py-10 border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-outfit text-sm font-bold text-white">
            <GraduationCap className="w-4 h-4 text-primary-container" />
            JagoanSoal
          </div>
          <p className="text-xs text-slate-500">
            © 2026 JagoanSoal. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }

  // App pages footer — minimal, matches dark theme
  return (
    <footer className="border-t border-white/5 py-6">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-outfit text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <GraduationCap className="w-4 h-4" />
          JagoanSoal
        </Link>
        <p className="text-xs text-slate-600">
          © 2026 JagoanSoal. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
