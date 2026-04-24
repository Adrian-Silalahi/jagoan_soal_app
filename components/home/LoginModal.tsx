"use client"
import { signIn } from 'next-auth/react'
import { X, GraduationCap } from 'lucide-react'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    // Full screen overlay — rendered directly into <body>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal card — centered */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl border border-white/15 shadow-[0_0_60px_rgba(108,92,231,0.25)] overflow-hidden"
        style={{ background: 'rgba(18, 18, 26, 0.95)' }}
      >
        {/* Top gradient accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary-container to-secondary-container" />

        <div className="p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(108, 92, 231, 0.15)', border: '1px solid rgba(108, 92, 231, 0.3)' }}
          >
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>

          {/* Text */}
          <div className="text-center mb-8">
            <h2 className="font-outfit text-2xl font-bold text-white mb-2">
              Masuk ke JagoanSoal
            </h2>
            <p className="text-sm text-slate-400">
              Gunakan akun Google kamu untuk mulai<br />generate soal secara gratis.
            </p>
          </div>

          {/* Google Sign-in Button */}
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <p className="text-xs text-center text-slate-600 mt-4">
            Gratis, tidak perlu kartu kredit.
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default LoginModal
