"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"

import SectionFeature from "../components/home/SectionFeature"
import SectionHeader from "../components/home/SectionHeader"
import SectionVideo from "../components/home/SectionVideo"

const HomeView = () => {
  return (
    <SessionProvider>
      <div className="-mt-24 bg-[#0A0A0F] text-on-background min-h-screen overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        <SectionHeader />
        <SectionVideo />
        <SectionFeature />
      </div>
    </SessionProvider>
  )
}

export default HomeView
