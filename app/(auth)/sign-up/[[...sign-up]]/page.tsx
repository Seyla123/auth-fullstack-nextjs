'use client'
// @typescript-eslint/no-explicit-any
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupFormSchema, SignupFormValues } from '@/lib/definitions'

import { useToast } from '@/hooks/use-toast'
import { useSignupMutation } from '@/lib/client/services/authApi' // Make sure to import the mutation hook
import Loading from '@/components/Loading'
import { ErrorDataType } from '../../sign-in/[[...sign-in]]/page'
import Link from 'next/link'
import { PasswordInput } from '@/components/ui/password-input'
import { useState } from 'react'

function Signup() {
  const { toast } = useToast()
  const [signup, { isLoading }] = useSignupMutation()
  const [currentPassword, setCurrentPassword] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Call the signup mutation from authApi
      await signup(data).unwrap(); // unwrap to get the response directly
      toast({
        title: 'Success',
        description: 'You have been successfully signed up!',
      });
    } catch (error) {
      const errorData = error as ErrorDataType;
      // Handle the error case
      toast({
        title: 'Error',
        description: errorData?.data?.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-center '>
      <section className='shadow-lg py-6 px-4 rounded max-w-sm w-full bg-white'>
        <h1 className='text-3xl text-center font-bold mb-4'>
          Join Us
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className='grid w-full items-center gap-4'>
          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='username'>
              Name
            </Label>
            <Input
              placeholder='username'
              type='text'
              {...register('username')}
              className={cn('focus-visible:ring-0 focus-visible:ring-offset-0', { 'border-red-500': errors?.username })}
            />
            {errors.username && <span className="text-red-500 text-[12px]">{String(errors?.username?.message)}</span>}
          </div>

          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='email'>
              Email
            </Label>
            <Input
              placeholder='example@mail.com'
              type='text'
              {...register('email')}
              className={cn('focus-visible:ring-0 focus-visible:ring-offset-0', { 'border-red-500': errors?.email })}
            />
            {errors.email && <span className="text-red-500 text-[12px]">{String(errors?.email?.message)}</span>}
          </div>

          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='password'>
              Password
            </Label>
            <PasswordInput
              placeholder='password'
              value={currentPassword}
              {...register('password')}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className={cn(' focus-visible:ring-0 focus-visible:ring-offset-0 ', { 'border-red-500': errors?.password })}
            />
            {errors.password && <span className="text-red-500 text-[12px]">{String(errors?.password?.message)}</span>}
          </div>

          <Button disabled={isLoading} type='submit' className='bg-dark-4'>

            {isLoading ? (
              <>
                <Loading title='Sign Up...' />
              </>
            ) : 'Sign up'}
          </Button>
        </form>
        <Link href='/sign-in'>
          <p className='text-center text-sm mt-4'>
            Already have an account? Sign in
          </p>
        </Link>
      </section>
    </main>
  )
}

export default Signup;

