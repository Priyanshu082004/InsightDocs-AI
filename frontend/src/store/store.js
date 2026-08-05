import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
// Store is initialized only. Feature slices (auth, documents, chat, etc.)
// will be implemented later alongside the Dashboard and Auth work.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
