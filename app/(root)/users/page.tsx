'use client'

import { Button } from '@/components/ui/button'
import React from 'react';
import { useSignoutMutation } from '@/lib/client/services/authApi';
import { toast } from '@/hooks/use-toast';
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';

const Page = () => {
    const [signoutUser] = useSignoutMutation()
    const signout = async () => {
        try {
            console.log('this clicked sigout');
            await signoutUser().unwrap();
            toast({
                title: 'Success',
                description: 'You have been successfully signed out!',
            })
        } catch (error) {
            const errorData = error as ErrorDataType;
            toast({
                title: 'Error',
                description: errorData?.data?.message||'An unknown error occurred.',
                variant: 'destructive',
            })
        }
    }
    return (
        <section>
            <h1>Users</h1>
            <Button onClick={signout}>Sign Out</Button>
        </section>
    )
}

export default Page
