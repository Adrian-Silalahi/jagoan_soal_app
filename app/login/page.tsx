import React from 'react'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import LoginView from '@/views/LoginView'



const Login = async () => {
    const session = await getServerSession(authOptions)
    if (session?.user) {
        redirect('/generate')
    }

    return (
       <LoginView />
    )
}

export default Login