import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '@/lib/client/services/authService';
import { User } from '@/app/api/auth/sign-in/route';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    // This action is used to reset the authentication state
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },

  extraReducers: (builder) => 

    // Check if the user is already authenticated
    builder.addMatcher(
      authApi.endpoints.checkAuth.matchFulfilled,
      (state, { payload }) => {
        state.isAuthenticated = true;
        state.user = payload.data;
      },
    );

    // Handle failed authentication check
    builder.addMatcher(authApi.endpoints.checkAuth.matchRejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
