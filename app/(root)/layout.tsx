import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
function layout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className='w-full mx-auto max-w-screen-3xl'>

                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </>
    )
}

export default layout