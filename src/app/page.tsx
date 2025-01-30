"use client";
// Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Create a form schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignIn() {
  const formSchema = z.object({
    email: z.string().email().min(3).max(30),
    password: z.string().min(6).max(30),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result && result.error) {
        console.log(result.error);
        toast.info("You should try asking your HR.", {
          duration: 5000,
          position: "top-right",
        });
        toast.error("Not found user");
        return false;
      }

      console.log("result : " ,result?.status);
      router.push("/dashboard");
      toast.success("Successfully Login");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="mx-auto w-[400px] rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Login
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormDescription>Japan System Login form</FormDescription>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                      <Input
                        type="password"
                        placeholder="Password validation is at least 6 character"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
