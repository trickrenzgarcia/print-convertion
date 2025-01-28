import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/form/login-form"
import { Metadata } from 'next';
import { auth } from '@/drizzle/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Login | (EMS) Print Convertion",
  description: "Login - Print Convertion",
};

export default async function LoginPage() {
  const session = await auth()

  if(session) {
    redirect('/')
  }
  
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Election Management System</span>
              <span className='font-bold'>Print Convertion</span>
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}