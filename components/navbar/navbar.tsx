"use client"
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { GraduationCap, ArrowRight, Menu, LogOut, ChevronDown, Wand2, BookOpen } from 'lucide-react'
import LoginModal from '../home/LoginModal'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'

// ─── Landing Navbar (dark glass) ─────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'demo', label: 'Demo' },
  { id: 'fitur', label: 'Fitur' },
]

const LandingNavInner = () => {
  const { data: session } = useSession()
  const [loginOpen, setLoginOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  // Detect active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <div className="flex justify-between items-center h-20 px-8 max-w-[1280px] mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent font-outfit">
          <GraduationCap className="w-7 h-7 text-primary-container" />
          <span>JagoanSoal</span>
        </div>

        {/* Nav links — berubah sesuai state login */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {session?.user ? (
            // Sudah login → langsung ke halaman app
            <>
              <Link
                href="/generate"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <Wand2 className="w-4 h-4" />
                Generate Soal
              </Link>
              <Link
                href="/banksoal"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Bank Soal
              </Link>
            </>
          ) : (
            // Belum login → anchor links dengan active state
            <>
              {NAV_SECTIONS.map(({ id, label }) => {
                const isActive = activeSection === id
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/8 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <span className="block h-0.5 mt-0.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all" />
                    )}
                  </a>
                )
              })}
            </>
          )}
        </div>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <UserDropdown session={session} landingPage />
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container text-sm font-medium hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(108,92,231,0.3)] transition-all duration-300"
            >
              <span>Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => !session?.user && setLoginOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </>
  )
}

// ─── App Navbar (dark, same system) ──────────────────────────────────────────
const AppNavInner = () => {
  const { data: session } = useSession()
  const [loginOpen, setLoginOpen] = useState(false)
  const pathName = usePathname()

  return (
    <>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <div className="flex justify-between items-center h-16 px-6 md:px-10 max-w-[1280px] mx-auto w-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-outfit font-bold text-lg bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
        >
          <GraduationCap className="w-5 h-5 text-primary-container" />
          JagoanSoal
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/generate"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              pathName === '/generate'
                ? 'bg-primary-container/15 text-primary border border-primary/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Wand2 className="w-4 h-4" />
            Generate Soal
          </Link>
          <Link
            href="/banksoal"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              pathName === '/banksoal'
                ? 'bg-secondary-container/15 text-secondary-container border border-secondary-container/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <BookOpen className="w-4 h-4" />
            Bank Soal
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <UserDropdown session={session} />
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container/15 text-primary border border-primary/20 text-sm font-medium hover:bg-primary-container/25 transition-all"
            >
              Masuk
            </button>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Shared user dropdown ─────────────────────────────────────────────────────
const UserDropdown = ({ session, landingPage }: { session: any, landingPage?: boolean }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
        <Avatar className="w-6 h-6">
          <AvatarImage src={session.user.image || ''} />
          <AvatarFallback className="bg-primary-container/30 text-primary text-xs font-bold">
            {session.user.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-white font-medium hidden sm:block">
          {session.user.name?.split(' ')[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="min-w-[180px] rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      style={{ background: 'rgba(18,18,26,0.97)', backdropFilter: 'blur(16px)' }}
    >
      <DropdownMenuLabel className="text-slate-500 text-xs font-normal px-3 py-2">
        {session.user.email}
      </DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-white/10 mx-1" />
      <DropdownMenuGroup>
        {/* Hanya tampilkan app links di dropdown saat di app pages, bukan landing */}
        {!landingPage && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/generate" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 cursor-pointer rounded-lg hover:bg-white/5 focus:bg-white/5">
                <Wand2 className="w-4 h-4 text-primary" />
                Generate Soal
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/banksoal" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 cursor-pointer rounded-lg hover:bg-white/5 focus:bg-white/5">
                <BookOpen className="w-4 h-4 text-secondary-container" />
                Bank Soal
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 mx-1" />
          </>
        )}
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-3 py-2 text-sm text-rose-400 cursor-pointer rounded-lg hover:bg-rose-500/10 focus:bg-rose-500/10"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)

// ─── Main Navbar wrapper ──────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const pathName = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathName === '/login') return null

  // Landing page
  if (pathName === '/') {
    return (
      <SessionProvider>
        <nav className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'bg-slate-950/70 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(108,92,231,0.08)]'
            : 'bg-transparent'
        )}>
          <LandingNavInner />
        </nav>
      </SessionProvider>
    )
  }

  // App pages (/generate, /banksoal, etc.)
  return (
    <SessionProvider>
      <nav className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        'bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/8',
        scrolled && 'shadow-[0_0_30px_rgba(0,0,0,0.5)]'
      )}>
        <AppNavInner />
      </nav>
    </SessionProvider>
  )
}

export default Navbar