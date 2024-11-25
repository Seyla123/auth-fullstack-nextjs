'use client';

import { Provider } from "react-redux";
import stores from "@/lib/client/stores/stores";
import { ProtectedRoute } from "@/middlewares/client/ProtectedRoute";
import { usePathname } from "next/navigation";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const adminRoute = ['/admin/users', '/admin/invites','/'];
    const userRoute = ['/users'];

    // Check if the current route is protected (admin or user routes)
    const isProtectedRoute = adminRoute.includes(pathname) || userRoute.includes(pathname);

    return (
        <Provider store={stores}>
            {isProtectedRoute ? (
                <ProtectedRoute>
                    {children}
                </ProtectedRoute>
            ) : (
                <>{children}</> // No protection for non-protected routes
            )}
        </Provider>
    );
}
