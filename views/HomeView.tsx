"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'

import SectionFeature from '../components/home/SectionFeature'
import SectionHeader from '../components/home/SectionHeader'
import SectionTechStack from '../components/home/SectionTechStack'
import SectionVideo from '../components/home/SectionVideo'

const HomeView = () => {

  return (
    <SessionProvider>
      <div className='-mt-24 bg-[#0A0A0F] text-on-background min-h-screen overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container'>
        <SectionHeader />
        <SectionVideo />
        <SectionFeature />
        <SectionTechStack />

      </div>
    </SessionProvider>
  )
}

export default HomeView