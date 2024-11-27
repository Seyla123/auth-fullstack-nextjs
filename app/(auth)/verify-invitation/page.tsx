'use client'
import React, { useEffect } from 'react'
import { useVerifyInvitationMutation } from '@/lib/client/services/authApi';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';  // Import useRouter
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';

function VerifyInvitationPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [verifyInvitation, { isSuccess, error }] = useVerifyInvitationMutation();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            verifyInvitation(token);
        }
    }, [verifyInvitation, token]);

    useEffect(() => {
        if (isSuccess) {
            router.replace(window.location.pathname); 
        }
    }, [isSuccess, router]);

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

export default VerifyInvitationPage;
