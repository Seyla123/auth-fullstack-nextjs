'use client'
import React, { useEffect } from 'react'
import { useVerifySignupMutation } from '@/lib/client/services/authApi';
import { useSearchParams } from 'next/navigation';
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';
function VerifyPage() {
    const [verifySignup, { data, isLoading, isSuccess, error }] = useVerifySignupMutation();
    const searchParams = useSearchParams()

    const token = searchParams.get('token')
    console.log('search :', token);
    useEffect(() => {
        verifySignup(token)
    }, [token])
    if (error) {
        const errorData = error as ErrorDataType;
        console.log('error :', errorData);
        return <div>error : {errorData?.data?.message} </div>
    }
    if (isSuccess) {
        return <div>Signup successful</div>
    }
    return (
        <div className='w-full flex justify-center h-screen'>
            verifying...
        </div>
    )
}

export default VerifyPage