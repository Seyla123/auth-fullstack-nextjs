import { baseApi } from '@/lib/client/services/baseApi';
import { SigninFormValues, SignupFormValues } from '@/lib/definitions';
import { User } from '@/app/api/auth/sign-in/route';

// Make sure you have the appropriate types defined elsewhere for DefaultResponse and BaseError
interface DefaultResponse {
  message: string;
  data?:User | null;
  // You can add other properties as needed
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Signup mutation
    signup: builder.mutation<DefaultResponse, SignupFormValues>({
      query: (user: User) => ({
        url: '/auth/sign-up', // Adjust the path as needed
        method: 'POST',
        body: user,
        credentials: 'include', // Includes cookies for authentication
      }),
      invalidatesTags: ['Auth'], // Tags for caching and invalidation
    }),

    // Login mutation
    signin: builder.mutation<DefaultResponse, SigninFormValues>({
      query: (user) => ({
        url: '/auth/sign-in', // Adjust the path as needed
        method: 'POST',
        body: user,
        credentials: 'include', // Includes cookies for authentication
      }),
    }),

    checkAuth: builder.query<DefaultResponse, void>({
      query: () => ({
        url: '/auth/me', 
        method: 'GET',
        credentials: 'include',
      }),
    })
  }),
  overrideExisting: false, // Set to true if you want to override existing endpoints
});

export const {
  useSignupMutation,
  useSigninMutation,
  useCheckAuthQuery
} = authApi;
