import React from "react"
import { redirect } from "next/navigation"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import LoginView from "@/views/LoginView"
import { getServerSession } from "next-auth"

const Login = async () => {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    redirect("/generate")
  }

  return <LoginView />
}

export default Login
