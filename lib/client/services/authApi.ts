import { baseApi } from '@/lib/client/services/baseApi';
import { SigninFormValues, SignupFormValues } from '@/lib/definitions';
import { User } from '@/app/api/auth/sign-in/route';

interface DefaultResponse {
  status: string;
  message: string;
  data?: User | null;
}

interface SignoutResponse {
  message: string,
  status: string
}

interface RegisterUserByInviteFormValues {
  token: string | null;
  password: string | null;
  username: string | null;
}
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Signup mutation
    signup: builder.mutation<DefaultResponse, SignupFormValues>({
      query: (user) => ({
        url: '/auth/sign-up', // Adjust the path as needed
        method: 'POST',
        body: user,
        credentials: 'include', // Includes cookies for authentication
      }),
      invalidatesTags: ['Auth'], // Tags for caching and invalidation
    }),

    // sign in mutation
    signin: builder.mutation<DefaultResponse, SigninFormValues>({
      query: (user) => ({
        url: '/auth/sign-in', // Adjust the path as needed
        method: 'POST',
        body: user,
        credentials: 'include', // Includes cookies for authentication
      }),
    }),

    // sign out mutation
    signout: builder.mutation<SignoutResponse, void>({
      query: () => ({
        url: '/auth/sign-out', // Adjust the path as needed
        method: 'POST',
        credentials: 'include', // Includes cookies for authentication
      }),
      invalidatesTags: ['Auth'],
    }),
    // check user credentials
    checkAuth: builder.query<DefaultResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    // verify user sign up
    verifySignup: builder.mutation<DefaultResponse, string | null>({
      query: (token) => ({
        url: `/auth/verify-email`,
        method: 'POST',
        params: { token },
        credentials: 'include',
      }),
    }),
    // verify invation token
    verifyInvitation: builder.mutation<DefaultResponse, string | null>({
      query: (token) => ({
        url: `/admin/users/invite/${token}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    // register user by invitation
    registerUserByInvite: builder.mutation<DefaultResponse, RegisterUserByInviteFormValues>({
      query: (user) => ({
        url: `/admin/users/register`,
        method: 'POST',
        body: user,
        credentials: 'include',
      }),
    })
  }),
  overrideExisting: false, // Set to true if you want to override existing endpoints
});

export const {
  useSignupMutation,
  useSigninMutation,
  useSignoutMutation,
  useCheckAuthQuery,
  useVerifySignupMutation,
  useVerifyInvitationMutation,
  useRegisterUserByInviteMutation
} = authApi;
