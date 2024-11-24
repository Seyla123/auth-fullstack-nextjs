
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-no-repeat bg-center bg-cover h-screen bg-auth">
            {children}
        </main>
    )
}

export default layout

