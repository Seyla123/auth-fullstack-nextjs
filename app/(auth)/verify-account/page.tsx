'use client'
import { GoBack } from "@/components/GoBack";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useResendVerificationSignupMutation } from "@/lib/client/services/authApi";
import { ErrorDataType } from "@/app/(auth)/sign-in/[[...sign-in]]/page";
import { toast } from "@/hooks/use-toast";

const VerifyAccountPage = () => {
    const [resendVerificationSignup, { isLoading }] = useResendVerificationSignupMutation();
    const handleResendEmail = async () => {
        try {
            await resendVerificationSignup().unwrap();
            toast({
                title: "Resend Success",
                description: "Verification email sent successfully",
            });
        } catch (error) {
            const errorData = error as ErrorDataType;
            toast({
                title: "Failed to resend email",
                description: errorData?.data?.message || "Failed to resend email",
                variant: "destructive",
            });
        }
        // Add functionality to resend verification email
        console.log("Resend email clicked");
    };

    return (

        <div className='flex flex-col items-center justify-center gap-4'>
            <div className="flex flex-col items-center justify-center gap-4">
                {/* Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-dark-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>

                {/* Header */}
                <h1 className="text-3xl text-center font-bold text-gray-800">
                    Please Verify Your Email
                </h1>

                {/* Instructions */}
                <p className="text-gray-600 text-center">
                    Your account has been created successfully. Please check your inbox
                    for the verification email.
                </p>
                <p className="text-gray-500 text-center text-sm">
                    If you didn’t receive it, click the button below.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <Button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    type='submit'
                    className='py-6 bg-dark-4'>
                    {isLoading ? (
                        <>
                            <Loading title='Resending Verification...' />
                        </>
                    ) : 'Resend Verification Email'}
                </Button>
                <GoBack title="Back to sign in" link="/sign-in" />
            </div>
        </div>

    );
};

export default VerifyAccountPage;
