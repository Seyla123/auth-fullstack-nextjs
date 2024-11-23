'use client'

import { Button } from '@/components/ui/button'
import React from 'react';
import { useSignoutMutation } from '@/lib/client/services/authApi';
import { toast } from '@/hooks/use-toast';

const Page = () => {
    const [signoutUser, { isLoading, isSuccess }] = useSignoutMutation()
    const signout = async () => {
        try {
            console.log('this clicked sigout');
            await signoutUser().unwrap();
            toast({
                title: 'Success',
                description: 'You have been successfully signed out!',
            })
        } catch (error) {
            console.log('error', error);
            toast({
                title: 'Error',
                description: 'An unknown error occurred.',
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
