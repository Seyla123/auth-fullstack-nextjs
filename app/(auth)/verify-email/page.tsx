'use client'
import React, { useEffect } from 'react'
import { useVerifySignupMutation } from '@/lib/client/services/authApi';
import { useSearchParams } from 'next/navigation';
import AngkorImg from '@/public/temple.jpg'
import { AuthLayout } from '@/components/AuthLayout';
import Loading from '@/components/Loading';
import SuccessImage from "@/public/verify-email-succes.svg"
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ErrorVerification } from '@/app/(auth)/register-invited-user/page';
function VerifyEmailPage() {
    const [verifySignup, { isLoading, isSuccess, error }] = useVerifySignupMutation();
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    
    useEffect(() => {
        verifySignup(token);
    }, [token])

    return (
        <AuthLayout img={AngkorImg} >

            {isLoading ?
                <LoadingVerify />
                : isSuccess ?
                    <VerifyEmailSuccess />
                    : !isLoading && error ?
                        <ErrorVerification />
                        :
                        <LoadingVerify />
            }
        </AuthLayout>
    )
}

export default VerifyEmailPage;
const VerifyEmailSuccess = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <Image src={SuccessImage} alt="success" width={300} height={300} />
            <p className='text-center text-lg font-semibold text-dark-1'>
                Your email has been verified successfully.
            </p>
            <Link href='/'>
                <Button defaultColor className='py-6 px-6'>
                    Go to Home
                </Button>
            </Link>
        </div>
    )
}
const LoadingVerify = () => {
    return (
        <>
            <h1 className='text-3xl text-center font-bold mb-4'>
                Please wait a minutes
            </h1>
            <Loading title='We verifying your account' />
        </>
    )
}