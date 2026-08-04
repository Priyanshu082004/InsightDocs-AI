import { createSlice } from "@reduxjs/toolkit";

// Minimal slice for now — just enough UI state (status/error/user) for the
// Signup and Login forms to dispatch into, without inventing auth
// behavior we don't have yet. Async logic (createAsyncThunk calling the
// real API) belongs here once the backend exists.
//
// TODO: Connect to the real register/login API. Replace the start/
// success/failure action pairs below with `createAsyncThunk`s once
// endpoints exist, and populate `user` from the response.
// TODO: JWT token handling — store/refresh the access token once the
// backend issues one.
// TODO: Session persistence — rehydrate `user` from storage on app load
// once there's a token to check against.
const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart(state) {
      state.status = "loading";
      state.error = null;
    },
    registerSuccess(state, action) {
      state.status = "succeeded";
      state.user = action.payload ?? null;
    },
    registerFailure(state, action) {
      state.status = "failed";
      state.error = action.payload ?? "Something went wrong. Please try again.";
    },
    loginStart(state) {
      state.status = "loading";
      state.error = null;
    },
    loginSuccess(state, action) {
      state.status = "succeeded";
      state.user = action.payload ?? null;
    },
    loginFailure(state, action) {
      state.status = "failed";
      state.error = action.payload ?? "Invalid email or password.";
    },
    resetAuthStatus(state) {
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  resetAuthStatus,
} = authSlice.actions;

export default authSlice.reducer;
