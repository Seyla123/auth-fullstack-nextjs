'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SigninFormSchema, SigninFormValues } from '@/lib/definitions'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useSigninMutation } from '@/lib/client/services/authApi'


function Signin() {
  const router = useRouter();
  const { toast } = useToast()
  const [signin, { isLoading }] = useSigninMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(SigninFormSchema),
  });

  const onSubmit = async (data: SigninFormValues) => {
    try {
      await signin(data).unwrap();
      toast({
        title: 'Success',
        description: 'You have been successfully signed up!',
      })
      router.push('/')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign up',
        variant: 'destructive',
      })
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

          </div>
          <Button disabled={isLoading} type='submit' className='bg-dark-4'>Sign in</Button>
        </form>
      </section>
    </main>
  )
}

export default Signin
