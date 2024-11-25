import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API
export const baseApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: 'include',
        prepareHeaders: (headers, { getState }: { getState: any }) => {
            const token = getState()?.auth?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: [
        'Users',
        'Auth',
        'Invite'
    ],
    endpoints: () => ({}),
});

