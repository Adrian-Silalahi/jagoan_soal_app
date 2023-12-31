"use client"
import { cn } from '@/lib/utils'
import { SessionProvider } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BurgerMenu } from '../burgermenu'
import ButtonSession from '../button-session'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname()


  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  if (pathName === '/login') {
    return null
  }

  return (
    <SessionProvider >
      <div className={cn("fixed inset-x-0 top-0 z-10 flex justify-between bg-white p-4 transition lg:px-12", isScrolled ? 'shadow-sm' : '')}>
        <Link href="/" className='inline-flex'>
          <Image src="/logo.png" alt="logo" width={38} height={17} />
          <p className='text-3xl font-semibold'>Jagoan Soal</p>
        </Link>

        <div className='hidden items-center gap-4 md:inline-flex'>
          <Link href="/generate" className={cn('rounded-lg px-3 py-2 text-sm font-semibold hover:bg-zinc-100', pathName === '/generate' && 'bg-zinc-100')}>Generate Soal</Link>
          <Link href="/banksoal" className={cn('rounded-lg px-3 py-2 text-sm font-semibold hover:bg-zinc-100', pathName === '/banksoal' && 'bg-zinc-100')}>Bank Soal</Link>
          <ButtonSession />
        </div>
        <div className='flex md:hidden'>
          <BurgerMenu />
        </div>
      </div>
    </SessionProvider>
  )
}

export default Navbar