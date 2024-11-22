'use client'
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

function Signup() {
  const { toast } = useToast()
  const [signup, { isLoading }] = useSignupMutation()
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
    } catch (error: any) {
      // Handle the error case
      toast({
        title: 'Error',
        description: error?.data?.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-center'>
      <section className='shadow-lg py-6 px-4 rounded max-w-sm w-full'>
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
            <Input
              placeholder='password'
              type='password'
              {...register('password')}
              className={cn('focus-visible:ring-0 focus-visible:ring-offset-0', { 'border-red-500': errors?.password })}
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
      </section>
    </main>
  )
}

export default Signup;
