'use client'
import React, { useEffect } from 'react'
import { useVerifySignupMutation } from '@/lib/client/services/authApi';
import { useSearchParams } from 'next/navigation';
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';
import AngkorImg from '@/public/temple.jpg'
import { AuthLayout } from '@/components/AuthLayout';
import Loading from '@/components/Loading';

function VerifyPage() {
    const [verifySignup, { data, isLoading, isSuccess, error }] = useVerifySignupMutation();
    const searchParams = useSearchParams()

    const token = searchParams.get('token')
    console.log('search :', token);
    useEffect(() => {
        verifySignup(token)
    }, [token])
    // if (error) {
    //     const errorData = error as ErrorDataType;
    //     console.log('error :', errorData);
    //     return <div>error : {errorData?.data?.message} </div>
    // }
    if (isSuccess) {
        return <div>verify Invitation link successful</div>
    }
    return (
        <AuthLayout img={AngkorImg} title={!isLoading?'Please wait a minutes':''}>
            {!isLoading ?  
            <Loading title='We verifying your account'/>
            :'fsadf' 
            }
        </AuthLayout>
    )
}

export default VerifyPage