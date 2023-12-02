"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import SectionContact from '../components/home/SectionContact'
import SectionFeature from '../components/home/SectionFeature'
import SectionHeader from '../components/home/SectionHeader'
import SectionVideo from '../components/home/SectionVideo'

const HomeView = () => {

  return (
    <SessionProvider>
      <div className='container'>
        <SectionHeader />
        <SectionVideo />
        <SectionFeature />
        {/* <SectionPricing /> */}
        <SectionContact />
      </div>
    </SessionProvider>
  )
}

export default HomeView