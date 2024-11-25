import React from 'react'


function layout({ children }: { children: React.ReactNode }) {
    return (
        <main  className=" py-6 flex flex-col gap-2 px-4">
            {children}
        </main>
    )
}

export default layout