'use client'
import React, { useEffect } from 'react'
import { useVerifyInvitationMutation } from '@/lib/client/services/authApi';
import { useSearchParams } from 'next/navigation';
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';

function VerifyInvitationPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [verifyInvitation, { data, isLoading, isSuccess, error }] = useVerifyInvitationMutation();
    useEffect(() => {
        verifyInvitation(token)
    }, [token, searchParams])
    console.log('this invitation : ', token);
    if (error) {
        const errorData = error as ErrorDataType;
        console.log('error :', errorData);

        return <div>error : {errorData.data?.message}</div>
    }
    if (isSuccess) {
        return <div>Invitation successful</div>
    }
    return (
        <div>Verify...</div>
    )
}

export default VerifyInvitationPage