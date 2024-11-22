'use client';

import { Provider } from "react-redux";
import stores from "@/lib/client/stores/stores";
import { ProtectedRoute } from "@/middlewares/client/ProtectedRoute";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={stores}>
            <ProtectedRoute>
                {children}
            </ProtectedRoute>
        </Provider >

    );
}