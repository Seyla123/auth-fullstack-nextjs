import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { baseApi } from './baseApi';
import { SignupFormValues } from '@/lib/definitions';
import { User } from '@/app/api/auth/sign-in/route';

// Make sure you have the appropriate types defined elsewhere for DefaultResponse and BaseError
interface DefaultResponse {
  message: string;
  // You can add other properties as needed
}

interface BaseError {
  status: number;
  message: string;
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
    login: builder.mutation<DefaultResponse, SignupFormValues>({
      query: (user) => ({
        url: '/auth/login', // Adjust the path as needed
        method: 'POST',
        body: user,
        credentials: 'include', // Includes cookies for authentication
      }),
    }),
  }),
  overrideExisting: false, // Set to true if you want to override existing endpoints
});

export const {
  useSignupMutation,
  useLoginMutation,
} = authApi;
