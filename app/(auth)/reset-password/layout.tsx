import React from 'react'
import ForgotPasswordImage from '@/public/temple.jpg'
import { AuthLayout } from '@/components/AuthLayout'
function layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout img={ForgotPasswordImage} >
            {children}
        </AuthLayout>
    )
}

export default layout