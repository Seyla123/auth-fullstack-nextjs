'use client'
import React, { useEffect } from 'react'
import { useVerifyResetPasswordMutation } from '@/lib/client/services/authApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';
import { ErrorVerification, LoadingVerify } from '@/app/(auth)/register-invited-user/page';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { PasswordInput } from '@/components/ui/password-input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Loading from '@/components/Loading';
import { ResetConfirmPasswordFormSchema, ResetConfirmPasswordFormValues } from '@/lib/definitions';
import { GoBack } from '@/components/GoBack';
function ResetPasswordPage() {
    const router = useRouter();
    const [verifyResetPassword, { isLoading, isSuccess, error }] = useVerifyResetPasswordMutation();
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetConfirmPasswordFormValues>({
        resolver: zodResolver(ResetConfirmPasswordFormSchema),
    });

    useEffect(() => {
        if (token) {
            verifyResetPassword(token);
        } else {
            const tokenLocal = localStorage.getItem('resetPasswordToken');
            verifyResetPassword(tokenLocal);
            router.replace(window.location.pathname);
        }
    }, [verifyResetPassword]);

    useEffect(() => {
        if (isSuccess) {
            if (token) {
                localStorage.setItem('resetPasswordToken', token);
            }
        }
    }, [isSuccess]);

    const onSubmit = async (data: ResetConfirmPasswordFormValues) => {
        console.log('this data : ', data);

    }
    // if (error) {
    //     const errorData = error as ErrorDataType;
    //     console.log('this : ', error);
    //     return <ErrorVerification title={errorData?.data?.message} />
    // }
    if (!isSuccess) {
        return (
            <>
                <div className='flex flex-col gap-8'>

                    <div>
                        <h1 className='text-3xl text-center font-bold mb-2'>
                            Set a new password
                        </h1>
                        <p className='text-medium md:text-sm text-gray-500  '>
                            Enter your new password to reset your password.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='grid w-full items-center gap-4'>
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
                        <div className='grid w-full items-center gap-1.5'>
                            <Label htmlFor='password' >
                                Confirm Password<sup className='text-red-500 font-bold text-sm'>*</sup>
                            </Label>
                            <PasswordInput
                                disabled={isLoading}
                                placeholder='confirm password'
                                {...register('confirmPassword')}
                                className={cn('py-6  focus-visible:ring-0 focus-visible:ring-offset-0 ', { 'border-red-500': errors?.confirmPassword })}
                            />
                            {errors.confirmPassword && <span className="text-red-500 text-[12px]">{String(errors?.confirmPassword?.message)}</span>}
                        </div>

                        <Button disabled={isLoading} defaultColor type='submit' className='py-6'>
                            {isLoading ? (
                                <>
                                    <Loading title='Resetting password...' />
                                </>
                            ) : 'Reset password'}
                        </Button>
                        <GoBack title='Back to Sign In' link='/sign-in' />
                    </form>
                </div>
            </>
        )
    }
    return <LoadingVerify title={'Verifying your reset password link'} />
}

export default ResetPasswordPage