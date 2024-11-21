import { User } from '@/app/api/auth/sign-in/route';
import { baseApi } from '@/lib/client/services/baseApi';

interface DefaultResponse {
    total: number;
    status: string;
    message: string;
    data: User[];
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Signup mutation
        getAllUsers: builder.query<DefaultResponse, void>({
            query: () => ({
                url: '/admin/users', // Adjust the path as needed
                method: 'GET',
                credentials: 'include', // Includes cookies for authentication
            }),
            providesTags: ['Users'], // Tags for caching 
        }),

    }),
    overrideExisting: false,
});

export const {
    useGetAllUsersQuery
} = userApi;
