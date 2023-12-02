import React from 'react'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import GenerateSoalView from '@/views/GenerateSoalView'

const page = async () => {
  const session = await getServerSession(authOptions)

  return (
    <GenerateSoalView session={session} />
  )
}

export default page