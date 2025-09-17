// src/store/slices/adminAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
   if (typeof window === "undefined") {
      return { token: null, admin: null, isAuthenticated: false };
   }
   const token = localStorage.getItem("adminToken");
   const admin = JSON.parse(localStorage.getItem("adminDetails"));
   return {
      token: token || null,
      admin: admin || null,
      isAuthenticated: !!token,
   };
};

const adminAuthSlice = createSlice({
   name: "adminAuth",
   initialState: getInitialState,
   reducers: {
      adminLoginSuccess: (state, action) => {
         state.token = action.payload.token;
         state.admin = action.payload.admin;
         state.isAuthenticated = true;
         if (typeof window !== "undefined") {
            localStorage.setItem("adminToken", action.payload.token);
            localStorage.setItem(
               "adminDetails",
               JSON.stringify(action.payload.admin)
            );
         }
      },
      adminLogout: (state) => {
         state.token = null;
         state.admin = null;
         state.isAuthenticated = false;
         if (typeof window !== "undefined") {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminDetails");
         }
      },
   },
});

export const { adminLoginSuccess, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
