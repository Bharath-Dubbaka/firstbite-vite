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

//FOR WITHOUT HTTPS TESTING IN PRODUCTION
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import AuthService from "../services/AuthService";
// import CheckoutCompleteModal from "../components/CheckoutCompleteModal";
// import { setUser } from "../store/slices/authSlice";
// import { setUserDetails } from "../store/slices/firebaseSlice";

// export default function CheckoutButton() {
//    const dispatch = useDispatch();
//    const cartItems = useSelector((s) => s.cart.items);
//    const auth = useSelector((s) => s.auth);
//    const [open, setOpen] = useState(false);
//    const [checkingAuth, setCheckingAuth] = useState(false);
//    const [authError, setAuthError] = useState(null);

//    // 🆕 Check for redirect result when component mounts
//    useEffect(() => {
//       const checkRedirectResult = async () => {
//          try {
//             console.log("🔄 CheckoutButton: Checking for redirect result...");

//             const redirectResult = await AuthService.handleRedirectResult(
//                dispatch,
//                setUser,
//                setUserDetails
//             );

//             if (redirectResult) {
//                console.log(
//                   "✅ Authentication completed, opening checkout modal"
//                );
//                // User just authenticated, open the checkout modal
//                setOpen(true);
//                setAuthError(null);
//             }
//          } catch (error) {
//             console.error("❌ Redirect authentication failed:", error);
//             setAuthError(error.message);
//          }
//       };

//       // Only check if we were waiting for a redirect
//       if (AuthService.isWaitingForRedirect()) {
//          checkRedirectResult();
//       }
//    }, [dispatch]);

//    // 🆕 Updated to handle redirect-based authentication
//    const ensureLoggedInThenOpen = async () => {
//       try {
//          setCheckingAuth(true);
//          setAuthError(null);

//          console.log("🎯 Checkout button clicked, checking auth state...");

//          // Check if user is already authenticated
//          if (auth.user && auth.user.uid) {
//             console.log("✅ User already authenticated, opening checkout");
//             setOpen(true);
//             return;
//          }

//          console.log("🚀 User not authenticated, starting redirect flow...");

//          // Store that we want to open checkout after auth
//          localStorage.setItem("openCheckoutAfterAuth", "true");

//          // Set redirect pending flag
//          AuthService.setRedirectPending();

//          // Start the redirect authentication process
//          await AuthService.signInWithGoogle(dispatch, setUser, setUserDetails);

//          // Code after this won't execute due to redirect
//          // The modal will open in the useEffect above when user returns
//       } catch (error) {
//          console.error("❌ Authentication error:", error);
//          setAuthError(error.message);
//          AuthService.clearRedirectPending();
//          localStorage.removeItem("openCheckoutAfterAuth");
//       } finally {
//          setCheckingAuth(false);
//       }
//    };

//    // 🆕 Check if we should open checkout after successful auth
//    useEffect(() => {
//       if (
//          auth.user &&
//          localStorage.getItem("openCheckoutAfterAuth") === "true"
//       ) {
//          console.log("✅ Opening checkout after successful authentication");
//          localStorage.removeItem("openCheckoutAfterAuth");
//          setOpen(true);
//       }
//    }, [auth.user]);

//    // 🆕 Show loading state if waiting for redirect
//    if (AuthService.isWaitingForRedirect()) {
//       return (
//          <div className="flex flex-col items-center space-y-2">
//             <button
//                disabled
//                className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow cursor-not-allowed flex items-center space-x-2"
//             >
//                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                <span>Authenticating...</span>
//             </button>
//             <p className="text-sm text-gray-600 text-center">
//                Redirecting to Google for authentication...
//             </p>
//          </div>
//       );
//    }

//    return (
//       <>
//          {/* 🆕 Auth Error Display */}
//          {authError && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//                <div className="flex items-center justify-between">
//                   <span className="text-sm">{authError}</span>
//                   <button
//                      onClick={() => setAuthError(null)}
//                      className="text-red-500 hover:text-red-700"
//                   >
//                      ×
//                   </button>
//                </div>
//             </div>
//          )}

//          <button
//             onClick={ensureLoggedInThenOpen}
//             disabled={!cartItems?.length || checkingAuth}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
//          >
//             {checkingAuth && (
//                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//             )}
//             <span>
//                {checkingAuth
//                   ? "Checking..."
//                   : cartItems?.length
//                   ? "Proceed to Checkout"
//                   : "Cart Empty"}
//             </span>
//          </button>

//          {open && <CheckoutCompleteModal onClose={() => setOpen(false)} />}
//       </>
//    );
// }
