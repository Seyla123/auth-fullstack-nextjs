// Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Redux Slice Reducers

// APIs Reducers
import { authApi } from '@/lib/client/services/authService';

const stores = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,

    },
    // Middleware for API calls
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
        ),
});

// Persist Store
setupListeners(stores.dispatch);

export default stores;
