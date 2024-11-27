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
import Loading from '@/components/Loading'
import Link from 'next/link'
import { PasswordInput } from '@/components/ui/password-input'
import AngkorImg from '@/public/angkor-img.jpg'
import { AuthLayout } from '@/components/AuthLayout'
export type ErrorDataType = { data: { message: string } }

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
      const response = await signin(data).unwrap();
      toast({
        title: 'Success',
        description: 'You have been successfully signed up!',
      })

      if (response?.data?.role == 'admin') {
        router.push('/admin/users')
      } else {
        router.push('/users')
      }
    } catch (error: unknown) {
      const errorData = error as ErrorDataType;
      toast({
        title: 'Error',
        description: errorData?.data?.message || 'Failed to sign up',
        variant: 'destructive',
      })
    }
  }

  return (

    <AuthLayout img={AngkorImg} title='Welcome back'>
      <>
        <form onSubmit={handleSubmit(onSubmit)} className='grid w-full items-center gap-4 '>
          <div className='grid w-full  items-center gap-1.5'>
            <Label htmlFor='email' >
              Email <sup className='text-red-500 font-bold text-sm'>*</sup>
            </Label>
            <div>
              <Input
                placeholder='example@mail.com'
                type='text'
                disabled={isLoading}
                {...register('email')}
                className={cn(' focus-visible:ring-0 focus-visible:ring-offset-0 py-6', { 'border-red-500': errors?.email })}
              />
              {errors.email && <span className="text-red-500 text-[12px]">{String(errors?.email?.message)}</span>}
            </div>

          </div>
          <div className='grid w-full  items-center gap-1.5'>
            <Label htmlFor='password' >
              Password <sup className='text-red-500 font-bold text-sm'>*</sup>
            </Label>
            <PasswordInput
              placeholder='password'
              {...register('password')}
              disabled={isLoading}
              className={cn('py-6 focus-visible:ring-0 focus-visible:ring-offset-0 ', { 'border-red-500': errors?.password })}
            />
            {errors.password && <span className="text-red-500 text-[12px]">{String(errors?.password?.message)}</span>}
          </div>
          <Link href='/forgot-password'>
            <p className='text-sm mt-0 text-right text-dark-4 '>
              Forgot password?
            </p>
          </Link>
          <Button disabled={isLoading} type='submit' className='py-6 bg-dark-4'>
            {isLoading ? (
              <>
                <Loading title='Sign in...' />
              </>
            ) : 'Sign in'}
          </Button>
        </form>
        <Link href='/sign-up'>
          <p className='text-center text-sm mt-4 text-dark-4'>
            Don&apos;t have an account? Sign up
          </p>
        </Link>
      </>
    </AuthLayout>
  )
}

export default Signin
