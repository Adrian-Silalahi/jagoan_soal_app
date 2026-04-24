import React from "react"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import GenerateSoalView from "@/views/GenerateSoalView"
import { getServerSession } from "next-auth"

const page = async () => {
  const session = await getServerSession(authOptions)

  return <GenerateSoalView session={session} />
}

export default page
