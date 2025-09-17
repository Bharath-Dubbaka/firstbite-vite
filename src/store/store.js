// store/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import firebaseReducer from "./slices/firebaseSlice";
import { createAuthMiddleware } from "./middleware/authMiddleware";
import adminAuthReducer from "./slices/adminAuthSlice";
import cartReducer from "./slices/cartSlice"; // <-- Import cart reducer

export const store = configureStore({
   reducer: {
      auth: authReducer,
      firebase: firebaseReducer,
      adminAuth: adminAuthReducer,
      cart: cartReducer, 
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }).concat(createAuthMiddleware),
});
