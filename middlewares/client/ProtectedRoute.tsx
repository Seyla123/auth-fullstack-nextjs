'use client'
import { ReactNode, useEffect } from "react";
import { useCheckAuthQuery } from "@/lib/client/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { usePathname, useRouter } from "next/navigation";
import { AuthState, resetAuthState } from "@/lib/client/stores/slices/authSlice";
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const pathname = usePathname();
    const dispatch = useDispatch();
    const adminRoute = ['/admin/users', '/']
    const userRoute = ['/users']

    // check if current route in protected route
    if (!adminRoute.includes(pathname) && !userRoute.includes(pathname)) {
        return <>
            {children}
        </>
    }
    // check if user is authenticated and has required role
    const { isLoading, isSuccess } = useCheckAuthQuery();
    const { isAuthenticated, user } = useSelector((state: { auth: AuthState }) => state.auth)
    useEffect(() => {
        if (pathname == '/' && isSuccess) {
            if (user?.role == 'admin') router.push('/admin/users')
            if (user?.role == 'user') router.push('/users')
        }
    }, [isSuccess, user?.role, router, pathname, user])


    if (!isSuccess && isLoading) return <Loading className="w-full flex justify-center h-screen" />

    if (!isAuthenticated) {
        router.push('/sign-in')
    }

    if (user?.role != 'admin' && user?.role != 'user') {
        dispatch(resetAuthState());
        return <>
            {children}</>
    }
    if (adminRoute.includes(pathname)) {
        if (user?.role != 'admin') {
            router.push('/unauthenticatedAdmin')
        }
    } else if (userRoute.includes(pathname)) {
        if (user?.role != 'user') {
            router.push('/unauthenticatedUser')
        }
    }
    return <>
        {children}
    </>
}