'use client';

import { Provider } from "react-redux";
import stores from "@/lib/client/stores/stores";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={stores}>{children}</Provider>;
}