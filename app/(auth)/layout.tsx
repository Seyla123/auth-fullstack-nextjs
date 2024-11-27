
import Loading from '@/components/Loading'
import React, { Suspense } from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<Loading className="w-full flex justify-center h-screen" />}>
            <main className="bg-no-repeat bg-center bg-cover h-screen bg-auth">
                {children}
            </main>
        </Suspense>
    )
}

export default layout

