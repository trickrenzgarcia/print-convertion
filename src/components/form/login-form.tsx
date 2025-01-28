"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { signIn } from "next-auth/react"
import { useToast } from '@/hooks/use-toast'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const loginFormSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    const response = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    })

    if(!response?.error) {
      router.push("/")
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "Wrong username or password.",
      })
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to admin account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your admin credentials to access the site.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='username'>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader2 className='animate-spin' />} Login
          </Button>
        </div>
      </form>
    </Form>
  )
}