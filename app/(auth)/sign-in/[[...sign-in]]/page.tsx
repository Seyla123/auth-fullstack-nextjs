'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupFormSchema, SignupFormValues } from '@/lib/definitions'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'


function Signin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      // Call the API route to sign up the user
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Check if the response is not OK
      if (!response.ok) {
        const errorData = await response.json(); // Try to parse error details if available
        throw new Error(errorData.message || 'Failed to sign up');
      }
      toast({
        title: 'Success',
        description: 'You have been successfully signed up!',
      })
    } catch (error : any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (

    <main className='flex  min-h-screen items-center justify-center'>
      <section className='shadow-lg py-6 px-4 rounded max-w-sm w-full'>
        <h1 className='text-3xl text-center font-bold mb-4'>
          Sign In
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className='grid w-full items-center gap-4'>
          <div className='grid w-full  items-center gap-1.5'>
            <Label htmlFor='username'>
              Name
            </Label>
            <Input
              placeholder='username'
              type='text'
              {...register('username')}
              className={cn(' focus-visible:ring-0 focus-visible:ring-offset-0 ', { 'border-red-500': errors?.username })}

            />
            {errors.username && <span className="text-red-500 text-[12px]">{String(errors?.username?.message)}</span>}

          </div>
          <div className='grid w-full  items-center gap-1.5'>
            <Label htmlFor='email'>
              Email
            </Label>
            <Input
              placeholder='example@mail.com'
              type='text'
              {...register('email')}
              className={cn(' focus-visible:ring-0 focus-visible:ring-offset-0 ', { 'border-red-500': errors?.email })}
            />
            {/* {errors?.email && <p className="text-red-500 text-[12px]">{errors.email}</p>} */}
            {errors.email && <span className="text-red-500 text-[12px]">{String(errors?.email?.message)}</span>}


          </div>
          <div className='grid w-full  items-center gap-1.5'>
            <Label htmlFor='password'>
              Password
            </Label>
            <Input
              placeholder='password'
              type='password'
              {...register('password')}
              className={cn(' focus-visible:ring-0 focus-visible:ring-offset-0 ', { 'border-red-500': errors?.password })}

            />
            {errors.password && <span className="text-red-500 text-[12px]">{String(errors?.password?.message)}</span>}
            {/* {errors?.password && (
              <div>
                <p className="text-red-500 text-[12px]">Password must:</p>
                <ul>
                  {errors.password.map((error) => (
                    <li key={error} className="text-red-500 text-[12px]">- {error}</li>
                  ))}
                </ul>
              </div>
            )} */}

          </div>
          <Button disabled={isLoading} type='submit' className='bg-dark-4'>Sign in</Button>
        </form>
      </section>
    </main>
  )
}

export default Signin
