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
    data: invitedUser
}


export const inviteUserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //get all invited users
        getAllInviteUsers: builder.query<DefaultResponse, void>({
            query: () => ({
                url: '/admin/users/invite',
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Invite'],
        }),
        // invite user
        inviteUser: builder.mutation<InviteUserResponse, InviteUserFormValues>({
            query: (data) => ({
                url: `/admin/users/invite`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['Invite'],
        }),
        // verify invite user
        verifyInviteUser: builder.mutation<VerifyUserResponse, void>({
            query: (token) => ({
                url: `/admin/users/invite/${token}`,
                method: 'GET',
                credentials: 'include',
            }),
            invalidatesTags: ['Invite'],
        }),
        //delete invited user
        deleteInvitedUser: builder.mutation<DeleteUserResponse, string | number>({
            query: (id) => ({
                url: `/admin/users/invite/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Invite'],
        }),
        // delete multiple invited users
        deleteManyInvitedUser: builder.mutation<DeleteUserResponse, string[]>({
            query: (ids) => ({
                url: `/admin/users/invite`,
                method: 'DELETE',
                body: {
                    "ids": ids
                },
                credentials: 'include',
            }),
            invalidatesTags: ['Invite'],
        }),
        // resend invitation to invited users
        resendInvitation: builder.mutation<InviteUserResponse, string>({
            query: (id) => ({
                url: `/admin/users/invite/${id}/resend`,
                method: 'POST',
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
    useDeleteInvitedUserMutation,
    useDeleteManyInvitedUserMutation,
    useResendInvitationMutation,
} = inviteUserApi;
