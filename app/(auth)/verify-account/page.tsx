'use client'
import { GoBack } from "@/components/GoBack";
import { Button } from "@/components/ui/button";
import React from "react";

const VerifyAccountPage = () => {
    const handleResendEmail = () => {
        // Add functionality to resend verification email
        console.log("Resend email clicked");
    };

    return (

        <div className='flex flex-col items-center justify-center gap-4'>
            <div className="flex flex-col items-center justify-center gap-4">
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-16 w-16 text-green-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                </svg>
                <h1 className='text-3xl text-center font-bold mb-2'>
                    Verify Your Email
                </h1>
                <p className='text-medium md:text-sm text-gray-500  '>
                    Your account has been created successfully, Please check your inbox for the verification link we
                    sent you.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <Button
                    defaultColor
                    onClick={handleResendEmail}
                    className="py-6 px-4"
                >
                    Resend Verification Email
                </Button>
                <GoBack title="Back home" link="/" />
            </div>
        </div>

    );
};

export default VerifyAccountPage;
