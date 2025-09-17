// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   // ✅ FIX: Separate Firebase auth data from user details
   user: null, // Firebase auth data: { uid, email, name, picture }
   isAuthenticated: false,
   loading: false,
   error: null,
};

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload;
         state.isAuthenticated = !!action.payload;
         state.loading = false;
         state.error = null;
      },
      setLoading: (state, action) => {
         state.loading = action.payload;
      },
      setError: (state, action) => {
         state.error = action.payload;
         state.loading = false;
      },
      logout: (state) => {
         state.user = null;
         state.isAuthenticated = false;
         state.loading = false;
         state.error = null;
      },
   },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
