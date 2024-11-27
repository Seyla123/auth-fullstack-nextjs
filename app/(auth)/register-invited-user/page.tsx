'use client'
import React, { useEffect } from 'react'
import { useVerifyInvitationMutation, useRegisterUserByInviteMutation } from '@/lib/client/services/authApi';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';  // Import useRouter
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';
import { useToast } from '@/hooks/use-toast';
import { AuthLayout } from '@/components/AuthLayout';
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import AngkorImg from '@/public/temple.jpg'
import { PasswordInput } from '@/components/ui/password-input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterUserByInviteFormSchema, RegisterUserByInviteFormValues } from '@/lib/definitions';
import Loading from '@/components/Loading';
import Image from 'next/image';
import ErrorImg from '@/public/fail-warning.svg'
function RegisterInvitedUserPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verifyInvitation, { isSuccess, error, isLoading: verifyLoading }] = useVerifyInvitationMutation();
  const { toast } = useToast()

  const [registerUser, { isLoading }] = useRegisterUserByInviteMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserByInviteFormValues>({
    resolver: zodResolver(RegisterUserByInviteFormSchema),
  });


  useEffect(() => {
    if (token) {
      verifyInvitation(token);
    } else {
      const tokenLocal = localStorage.getItem('invitedToken');
      verifyInvitation(tokenLocal);
    }

  }, [verifyInvitation]);


  useEffect(() => {
    if (isSuccess) {
      if (token) {
        localStorage.setItem('invitedToken', token);
      }
      router.replace(window.location.pathname);
    }
  }, [isSuccess, router]);

  const onSubmit = async (data: RegisterUserByInviteFormValues) => {
    try {
      const invitedToken = token || localStorage.getItem('invitedToken');
      const response = await registerUser({
        token: invitedToken,
        ...data
      }).unwrap();
      localStorage.removeItem('invitedToken');
      toast({
        title: 'Success',
        description: 'You have been successfully registered!',
      })
      if (response?.data?.role == 'admin') {
        router.push('/admin/users')
      } else {
        router.push('/users')
      }

    } catch (error) {
      const errorData = error as ErrorDataType;
      console.log('error registering user', errorData);
      toast({
        title: 'Error',
        description: errorData?.data?.message || 'An unknown error occurred.',
        variant: 'destructive',
      })

    }
  }

  return (
    <AuthLayout img={AngkorImg} title={isSuccess ? 'Complete Registration' : ''}>
      {
        verifyLoading ? <LoadingVerify />
          :
          (!verifyLoading && error ?
            <ErrorVerification />
            : isSuccess ?
              <>
                <form onSubmit={handleSubmit(onSubmit)} className='grid w-full items-center gap-4'>
                  <div className='grid w-full items-center gap-1.5'>
                    <Label htmlFor='username'>
                      Username<sup className='text-red-500 font-bold text-sm'>*</sup>
                    </Label>
                    <Input
                      placeholder='username'
                      type='text'
                      disabled={isLoading}
                      {...register('username')}
                      className={cn('py-6 focus-visible:ring-0 focus-visible:ring-offset-0', { 'border-red-500': errors?.username })}
                    />
                    {errors.username && <span className="text-red-500 text-[12px]">{String(errors?.username?.message)}</span>}
                  </div>
                  <div className='grid w-full items-center gap-1.5'>
                    <Label htmlFor='password'>
                      Password<sup className='text-red-500 font-bold text-sm'>*</sup>
                    </Label>
                    <PasswordInput
                      disabled={isLoading}
                      placeholder='password'
                      {...register('password')}
                      className={cn('py-6  focus-visible:ring-0 focus-visible:ring-offset-0 ', { 'border-red-500': errors?.password })}
                    />
                    {errors.password && <span className="text-red-500 text-[12px]">{String(errors?.password?.message)}</span>}
                  </div>

                  <Button disabled={isLoading} defaultColor type='submit' className='py-6'>
                    {isLoading ? (
                      <>
                        <Loading title='Registering...' />
                      </>
                    ) : 'Register now'}
                  </Button>
                </form>
                <Link href='/sign-in'>
                  <p className='text-center text-sm mt-4'>
                    Already have an account? Sign in
                  </p>
                </Link>
              </> : <LoadingVerify />
          )
      }

    </AuthLayout>
  )

}

export default RegisterInvitedUserPage;

export const ErrorVerification = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Image src={ErrorImg} alt="error" width={300} height={300} />
      <p className='text-center text-lg font-semibold text-dark-1'>
        Invalid or expired link
      </p>
      <Link href='/sign-in'>
        <Button className='py-6 px-6 ' defaultColor>
          Back to Sign In
        </Button>
      </Link>
    </div>
  )
}
const LoadingVerify = () => {
  return (
    <>
      <h1 className='text-3xl text-center font-bold mb-4'>
        Please wait a moment
      </h1>
      <Loading title='Verifying your invition link' />
    </>
  )
}