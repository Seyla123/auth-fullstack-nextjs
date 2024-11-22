import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/lib/client/services/authApi";
import { User } from "@/app/api/auth/sign-in/route";

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.signout.matchFulfilled, (state, { payload }) => {
      state.isAuthenticated = false;
      state.user = null;
    });

    builder.addMatcher(authApi.endpoints.signin.matchFulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.user = payload.data as User;
    });

    builder.addMatcher(authApi.endpoints.checkAuth.matchFulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.user = payload.data as User;
    });

    builder.addMatcher(authApi.endpoints.checkAuth.matchRejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  }
});
export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;


