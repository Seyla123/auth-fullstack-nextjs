'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ForgotPasswordFormSchema, ForgotPasswordFormValues } from '@/lib/definitions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { GoBack } from '@/components/GoBack'
import { useForgotPasswordMutation } from '@/lib/client/services/authApi';
import Link from 'next/link'
import { ErrorDataType } from "@/app/(auth)/sign-in/[[...sign-in]]/page";
import { CircleX } from 'lucide-react';
import Loading from '@/components/Loading'

function ForgotPasswordPage() {
    const [forgotPassword, { isLoading, isSuccess, error }] = useForgotPasswordMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(ForgotPasswordFormSchema),
    });
    const submit = async (data: ForgotPasswordFormValues) => {
        await forgotPassword(data).unwrap();
        console.log('this data :', data);
    }
    if (isSuccess) {
        return <div>Email sent successfully, please check your inbox.</div>
    }
    if (error) {
        const errorData = error as ErrorDataType
        return (
            <div className='flex flex-col items-center justify-center gap-4'>
                {/* <Image src={ForgotPasswordImageError} alt="error" width={300} height={300} /> */}
                <CircleX color='red' size={100} />
                <h1 className='text-3xl text-center font-bold '>
                    Something went wrong
                </h1>
                <p className='text-center text-medium  text-dark-1'>
                    {errorData?.data?.message || 'Email not found, please try again.'}
                </p>
                <Link href='/sign-in'>
                    <Button className='py-6 px-6 ' defaultColor>
                        Back to Sign In
                    </Button>
                </Link>
            </div>
        )
    }
    return (
        <div className='flex flex-col gap-8'>
            <div>
                <h1 className='text-3xl text-center font-bold mb-2'>
                    Forgot password?
                </h1>
                <p className='text-medium md:text-sm text-gray-500  '>
                    No worries,  we'll send you an email with instructions to reset your
                    password.
                </p>
            </div>
            <form onSubmit={handleSubmit(submit)} className='grid w-full items-center gap-4 '>
                <div className='grid w-full items-center gap-1.5'>
                    <Label htmlFor='email'>
                        Email<sup className='text-red-500 font-bold text-sm'>*</sup>
                    </Label>
                    <Input
                        placeholder='example@mail.com'
                        type='text'
                        disabled={isLoading}
                        {...register('email')}
                        className={cn('py-6 focus-visible:ring-0 focus-visible:ring-offset-0', { 'border-red-500': errors?.email })}
                    />
                    {errors.email && <span className="text-red-500 text-[12px]">{String(errors?.email?.message)}</span>}
                </div>
                <Button disabled={isLoading} defaultColor type='submit' className='py-6'>
                    {isLoading ? (
                        <>
                            <Loading title='Forgotting password...' />
                        </>
                    ) : 'Forgot Password'}
                </Button>
                <GoBack title='Back to Sign In' link='/sign-in' />
            </form>
        </div>

    )
}

export default ForgotPasswordPage;
