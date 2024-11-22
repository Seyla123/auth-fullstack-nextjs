'use client';

import { ReactNode, useEffect, useState } from "react";
import { useCheckAuthQuery } from "@/lib/client/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { usePathname, useRouter } from "next/navigation";
import { AuthState, resetAuthState } from "@/lib/client/stores/slices/authSlice";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const adminRoute = ['/admin/users'];
    const userRoute = ['/users'];
    // Track loading and redirection state
    const [isRedirecting, setIsRedirecting] = useState(true);

    const { data, isLoading, isSuccess } = useCheckAuthQuery();
    const { isAuthenticated, user } = useSelector((state: { auth: AuthState }) => state.auth);

    // Redirect logic inside useEffect to avoid triggering it during rendering
    useEffect(() => {
        if (isSuccess && data) {
            console.log('pathname ', pathname);
            console.log('user ', user, isAuthenticated);

            // Redirect user to appropriate page if they're on the root
            // If user is not authenticated, protect the routes
            if (!isAuthenticated) {
                router.push('/sign-in');
                return;
            }
            if (pathname == '/') {
                console.log('this is function ', pathname);

                if (user?.role === 'admin') {
                    router.push('/admin/users');
                } else if (user?.role === 'user') {
                    router.push('/users');
                }
                return;
            }
            // Check if the route is not protected and just return children without further checks
            if (![...adminRoute, ...userRoute].includes(pathname)) {
                // If it's not a protected route, just render the children
                setIsRedirecting(false);
                return;
            }


            // If user role isn't valid, reset auth state and redirect to home
            if (user?.role !== 'admin' && user?.role !== 'user') {
                dispatch(resetAuthState());
                router.push('/');
                return;
            }

            // Handle route redirections based on role
            if (adminRoute.includes(pathname)) {
                if (user?.role !== 'admin') {
                    router.replace('/unauthorized');
                    return;
                }
            } else if (userRoute.includes(pathname)) {
                if (user?.role !== 'user') {
                    router.replace('/unauthorized');
                    return;
                }
            }



            // Once all checks pass, stop redirecting
            setIsRedirecting(false);
        }

    }, [isAuthenticated, user, pathname, isLoading, dispatch, router]);

    // Show loading spinner while checking auth status
    if (isLoading || isRedirecting) {
        return <Loading className="w-full flex justify-center h-screen " />;
    }

    // Render the children if user is authorized for the route or if it's an unprotected route
    return <>{children}</>;
};
