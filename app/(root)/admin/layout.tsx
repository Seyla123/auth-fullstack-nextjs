import React from 'react'
import Header from '@/app/(root)/admin/_header'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <main  className=" py-6 flex flex-col gap-2 px-4">
            <Header />
            {children}
        </main>
    )
}

export default layout