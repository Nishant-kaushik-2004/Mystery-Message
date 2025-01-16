import { configureStore } from '@reduxjs/toolkit';
import profileReducer from "@/app/redux/features/profileSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;