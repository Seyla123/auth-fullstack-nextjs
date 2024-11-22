// Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Redux Slice Reducers
import authReducer from '@/lib/client/stores/slices/authSlice'
// APIs Reducers
import { authApi } from '@/lib/client/services/authApi';
import { userApi } from '@/lib/client/services/admin/userApi';

const stores = configureStore({
    reducer: {
        auth : authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer

    },
    // Middleware for API calls
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware
        ),
});

// Persist Store
setupListeners(stores.dispatch);

export default stores;
