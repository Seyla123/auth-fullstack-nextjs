import { User } from '@/app/api/auth/sign-in/route';
import { baseApi } from '@/lib/client/services/baseApi';
import { InviteUserFormValues } from '@/lib/definitions';
import { invitedUser } from '@/lib/server/utils/authUtils';
import { DeleteUserResponse } from './userApi';

interface DefaultResponse {
    total: number;
    status: string;
    message: string;
    data: invitedUser[];
}
type InviteUserResponse = {
    status: string;
    message: string;
    data: {
        username: string;
        email: string;
        role: string;
    };
};

interface VerifyUserResponse {
    status: string;
    message: string;
    data:invitedUser
}


export const inviteUserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Signup mutation
        getAllInviteUsers: builder.query<DefaultResponse, void>({
            query: () => ({
                url: '/admin/users/invite', // Adjust the path as needed
                method: 'GET',
                credentials: 'include', // Includes cookies for authentication
            }),
            providesTags: ['Invite'], // Tags for caching 
        }),
        inviteUser: builder.mutation<InviteUserResponse, InviteUserFormValues>({
            query: (data) => ({
                url: `/admin/users/invite`,
                method: 'POST',
                body:data,
                credentials: 'include',
            }),
            invalidatesTags: ['Invite'],
        }),
        verifyInviteUser: builder.mutation<VerifyUserResponse, void>({
            query: (token) => ({
                url: `/admin/users/invite/${token}`,
                method: 'GET',
                credentials: 'include',
            }),
            invalidatesTags: ['Invite'],
        }),
        deleteInvitedUser: builder.mutation<DeleteUserResponse, string|number>({
            query: (id) => ({
                url: `/admin/users/invite/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Invite'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllInviteUsersQuery,
    useInviteUserMutation,
    useVerifyInviteUserMutation,
    useDeleteInvitedUserMutation
} = inviteUserApi;
