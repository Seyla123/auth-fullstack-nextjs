'use client'
import { AppSidebar } from "@/components/ui/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const paths = pathname.split("/").filter((path) => path !== "")

    const BreadCrumb = () => {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink
                            href="/"
                            className={
                                paths.length === 0 ? "font-bold" : ""
                            }
                        >
                            App
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {paths.map((path, index) => {
                        return (
                            <React.Fragment key={path}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={`/${paths
                                            .slice(0, index + 1)
                                            .join("/")}`}
                                        className={
                                            paths.length ===
                                                index + 1
                                                ? "font-bold capitalize"
                                                : "capitalize"
                                        }
                                    >
                                        {path}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </React.Fragment>
                        )
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        )
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <BreadCrumb />
                    </div>
                </header>
                <main className="max-w-screen-3xl mx-auto w-full">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

