// Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Redux Slice Reducers

// APIs Reducers
import { authApi } from '@/lib/client/services/authService';
import { userApi } from '@/lib/client/services/admin/userService';

const stores = configureStore({
    reducer: {
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
