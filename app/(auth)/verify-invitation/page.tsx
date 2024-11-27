'use client'
import React, { useEffect, useState } from 'react'
import { useVerifyInvitationMutation, useRegisterUserByInviteMutation } from '@/lib/client/services/authApi';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';  // Import useRouter
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';
import { Button } from '@/components/ui/button';

function VerifyInvitationPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [verifyInvitation, { isSuccess, error }] = useVerifyInvitationMutation();
    const [registerUser, { isSuccess: registerSuccess, error: registerError }] = useRegisterUserByInviteMutation();
    const router = useRouter();
    const [invitedToken, setInvitedToken] = useState<string | null>('')

    useEffect(() => {
        if (token) {
            setInvitedToken(token)
            verifyInvitation(token);
        }
    }, [verifyInvitation, token]);

    useEffect(() => {
        if (isSuccess) {
            router.replace(window.location.pathname);
        }
    }, [isSuccess, router]);
    const handlSubmit = async () => {
        try {
            // await registerUser({
            //     token: invitedToken,
            //     username: "newusername",
            //     password: "newpassword123@4"
            // });
            console.log('register success');

        } catch (error) {
            console.log('error registering user', error);

        }
    }
    console.log('this invitation : ', invitedToken);
    if (error) {
        const errorData = error as ErrorDataType;
        console.log('error :', errorData);

        return <div>error : {errorData.data?.message}</div>
    }

    if (isSuccess) {
        return <div>Invitation successful
            <Button onClick={handlSubmit}>Register</Button>
        </div>
    }

    return (
        <div>Verify...</div>
    )
}

export default VerifyInvitationPage;
