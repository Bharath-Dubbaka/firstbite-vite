// store/slices/firebaseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   userDetails: null, // Database user details from your backend
   loading: false,
   error: null,
};

const firebaseSlice = createSlice({
   name: "firebase",
   initialState,
   reducers: {
      setUserDetails: (state, action) => {
         state.userDetails = action.payload;
         state.loading = false;
         state.error = null;
      },
      updateUserDetails: (state, action) => {
         if (state.userDetails) {
            state.userDetails = { ...state.userDetails, ...action.payload };
         } else {
            state.userDetails = action.payload;
         }
         state.error = null;
      },
      setLoading: (state, action) => {
         state.loading = action.payload;
      },
      setError: (state, action) => {
         state.error = action.payload;
         state.loading = false;
      },
      clearFirebaseData: (state) => {
         state.userDetails = null;
         state.loading = false;
         state.error = null;
      },
   },
});

export const {
   setUserDetails,
   updateUserDetails,
   setLoading,
   setError,
   clearFirebaseData,
} = firebaseSlice.actions;

export default firebaseSlice.reducer;
