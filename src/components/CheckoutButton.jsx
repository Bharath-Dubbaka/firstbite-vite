import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthService from "../services/AuthService"; // your existing service
import CheckoutCompleteModal  from "../components/CheckoutCompleteModal";

export default function CheckoutButton() {
   const dispatch = useDispatch();
   const cartItems = useSelector((s) => s.cart.items);
   const auth = useSelector((s) => s.auth); // { user, userDetails, ... }
   const [open, setOpen] = useState(false);
   const [checkingAuth, setCheckingAuth] = useState(false);

   const ensureLoggedInThenOpen = async () => {
      try {
         setCheckingAuth(true);

         if (!auth.user) {
            // Use your existing,existing AuthService to handle login
            await AuthService.handleAuthFlow(
               dispatch,
               auth.user,
               auth.userDetails,
               {
                  setUser: (u) =>
                     dispatch({ type: "auth/setUser", payload: u }),
                  setUserDetails: (d) =>
                     dispatch({ type: "auth/setUserDetails", payload: d }),
               }
            );
            // Wait for auth state to update
            const updatedAuth = store.getState().auth; // You'll need access to store
            if (!updatedAuth.user) {
               throw new Error("Login failed");
            }
         }

         setOpen(true);
      } catch (e) {
         alert(`Please login to continue. ${e?.message ?? ""}`);
      } finally {
         setCheckingAuth(false);
      }
   };

   return (
      <>
         <button
            onClick={ensureLoggedInThenOpen}
            disabled={!cartItems?.length || checkingAuth}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
         >
            {checkingAuth
               ? "Checking..."
               : cartItems?.length
               ? "Proceed to Checkout"
               : "Cart Empty"}
         </button>

         {open && <CheckoutCompleteModal  onClose={() => setOpen(false)} />}
      </>
   );
}
