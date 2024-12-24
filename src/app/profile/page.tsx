'use client'
import { useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'

export default function Profile() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        }
    }, [status, router])
    console.log('session', session)
    console.log('status', status)
    return (
        status === 'authenticated' && session.user && (
            <div>
                <h1>Profile</h1>
                <div>
                    <p>Name: {session.user.name}</p>
                    <p>Email: {session.user.email}</p>
                    <p>Role : {session.user.role}</p>
                    <p>createAt : {session.user.createdAt}</p>
                </div>
                <button onClick={() => signOut({ callbackUrl: '/' })}>LogOut</button>
            </div>
        )
    )
}