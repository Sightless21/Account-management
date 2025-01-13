'use client'

//import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Components
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Create a form schema
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function SignIn() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  const formSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(30),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setEmail(values.username)
    setPassword(values.password)

    if(email === "John@test.com"&& password === "123456"){
      router.push('/dashboard')
    }
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   try {
  //     const result = await signIn('credentials', {
  //       redirect: false,
  //       email,
  //       password,
  //     })
  //     if (result?.error) {
  //       console.log('error', result.error)
  //       return false
  //     }
  //     //Login successful
  //     router.push('/profile')
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="w-[400px] mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Login
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormDescription>Japan System Login form</FormDescription>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder="JohnDoe@gmail.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input type="password" placeholder="Password validation is at least 6 character" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className='w-full'>Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}