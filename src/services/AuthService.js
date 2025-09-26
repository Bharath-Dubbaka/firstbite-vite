// services/AuthService.js

//FOR PRODUCTION WITH HTTPS
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { UserDetailsService } from "./UserDetailsService";

class AuthService {
   static async signInWithGoogle(dispatch, setUser, setUserDetails) {
      try {
         const provider = new GoogleAuthProvider();
         const result = await signInWithPopup(auth, provider);
         const idToken = await result.user.getIdToken();

         // Store token for API calls
         localStorage.setItem("firebaseToken", idToken);

         // ✅ FIX: Create clean user data object
         const name =
            result.user.displayName ||
            result.user.email?.split("@")[0] ||
            "User";

         const userData = {
            email: result.user.email,
            name: result.user.displayName,
            picture: result.user.photoURL,
            uid: result.user.uid,
         };

         console.log("Google login successful for:", userData.email);

         // ✅ FIX: Set user in Redux immediately
         dispatch(setUser(userData));

         try {
            // ✅ FIX: Try to save/update user details in backend
            const savedDetails = await UserDetailsService.saveUserDetails(
               userData
            );
            console.log("User details saved to backend");

            // ✅ FIX: Update Redux with complete user details
            dispatch(setUserDetails(savedDetails));

            return { userData, details: savedDetails };
         } catch (backendError) {
            console.warn(
               "Backend save failed, trying to fetch existing:",
               backendError.message
            );

            try {
               // If save failed, try to fetch existing details
               const existingDetails =
                  await UserDetailsService.getUserDetails();
               if (existingDetails) {
                  dispatch(setUserDetails(existingDetails));
                  return { userData, details: existingDetails };
               }
            } catch (fetchError) {
               console.warn(
                  "Fetch existing details failed:",
                  fetchError.message
               );
            }

            // If all else fails, continue with just user data
            console.log("Continuing with user data only");
            return { userData, details: null };
         }
      } catch (error) {
         console.error("Google sign-in failed:", error);
         throw new Error(`Google sign-in failed: ${error.message}`);
      }
   }

   static async signOut(dispatch, logout) {
      try {
         await auth.signOut();
         localStorage.removeItem("firebaseToken");
         dispatch(logout());
         console.log("User signed out successfully");
         return true;
      } catch (error) {
         console.error("Logout error:", error);
         return false;
      }
   }

   static async handleAuthFlow(dispatch, user, userDetails, actions) {
      console.log("handleAuthFlow called");

      try {
         // ✅ FIX: Check if user is already logged in
         if (user && user.uid) {
            console.log("User already authenticated:", user.email);

            // If no userDetails, try to fetch them
            if (!userDetails) {
               try {
                  const details = await UserDetailsService.getUserDetails();
                  if (details) {
                     dispatch(actions.setUserDetails(details));
                  }
               } catch (error) {
                  console.warn("Could not fetch user details:", error.message);
               }
            }

            return { userData: user, details: userDetails };
         }

         // ✅ FIX: Proceed with Google sign-in
         console.log("Starting Google authentication...");
         const result = await this.signInWithGoogle(
            dispatch,
            actions.setUser,
            actions.setUserDetails
         );

         console.log("Authentication flow completed successfully");
         return result;
      } catch (error) {
         console.error("Auth flow error:", error);
         throw new Error(`Authentication failed: ${error.message}`);
      }
   }

   // ✅ NEW: Helper method to check if user needs phone number
   static needsPhoneNumber(userDetails) {
      return !userDetails?.phoneNumber;
   }

   // ✅ NEW: Helper method to check if user can place orders
   static canPlaceOrders(userDetails) {
      return userDetails?.phoneNumber && userDetails?.addresses?.length > 0;
   }
}

export default AuthService;

//FOR PRODUCTION WITHOUT HTTPS
// services/AuthService.js
// import { auth } from "./firebase";
// import {
//    GoogleAuthProvider,
//    signInWithRedirect,
//    getRedirectResult,
//    onAuthStateChanged,
// } from "firebase/auth";
// import { UserDetailsService } from "./UserDetailsService";

// class AuthService {
//    // NEW: Initialize redirect-based Google sign-in
//    static async signInWithGoogle(dispatch, setUser, setUserDetails) {
//       try {
//          console.log("Starting Google redirect authentication...");
//          const provider = new GoogleAuthProvider();

//          // Add scopes
//          provider.addScope("email");
//          provider.addScope("profile");

//          // Set custom parameters if needed
//          provider.setCustomParameters({
//             prompt: "select_account",
//          });

//          // Redirect to Google sign-in (this will navigate away from your app)
//          await signInWithRedirect(auth, provider);

//          // Note: Code after this line won't execute as user is redirected
//          // The result will be handled by handleRedirectResult()
//       } catch (error) {
//          console.error("Google redirect sign-in failed:", error);
//          throw new Error(`Google sign-in failed: ${error.message}`);
//       }
//    }

//    // NEW: Handle redirect result when user comes back from Google
//    static async handleRedirectResult(dispatch, setUser, setUserDetails) {
//       try {
//          console.log("Checking for redirect result...");
//          const result = await getRedirectResult(auth);

//          if (!result) {
//             console.log("No redirect result found");
//             return null;
//          }

//          console.log("Redirect result found:", result.user.email);
//          const idToken = await result.user.getIdToken();

//          // Store token for API calls
//          localStorage.setItem("firebaseToken", idToken);

//          // Create clean user data object
//          const userData = {
//             email: result.user.email,
//             name: result.user.displayName,
//             picture: result.user.photoURL,
//             uid: result.user.uid,
//          };

//          console.log("Google login successful for:", userData.email);

//          // Set user in Redux immediately
//          dispatch(setUser(userData));

//          try {
//             // Try to save/update user details in backend
//             const savedDetails = await UserDetailsService.saveUserDetails(
//                userData
//             );
//             console.log("User details saved to backend");

//             // Update Redux with complete user details
//             dispatch(setUserDetails(savedDetails));

//             return { userData, details: savedDetails };
//          } catch (backendError) {
//             console.warn(
//                "Backend save failed, trying to fetch existing:",
//                backendError.message
//             );

//             try {
//                // If save failed, try to fetch existing details
//                const existingDetails =
//                   await UserDetailsService.getUserDetails();
//                if (existingDetails) {
//                   dispatch(setUserDetails(existingDetails));
//                   return { userData, details: existingDetails };
//                }
//             } catch (fetchError) {
//                console.warn(
//                   "Fetch existing details failed:",
//                   fetchError.message
//                );
//             }

//             // If all else fails, continue with just user data
//             console.log("Continuing with user data only");
//             return { userData, details: null };
//          }
//       } catch (error) {
//          console.error("Redirect result handling failed:", error);

//          // Handle specific error cases
//          if (error.code === "auth/account-exists-with-different-credential") {
//             throw new Error(
//                "An account already exists with the same email address but different sign-in credentials."
//             );
//          } else if (error.code === "auth/credential-already-in-use") {
//             throw new Error(
//                "This credential is already associated with a different user account."
//             );
//          } else {
//             throw new Error(`Authentication failed: ${error.message}`);
//          }
//       }
//    }

//    static async signOut(dispatch, logout) {
//       try {
//          await auth.signOut();
//          localStorage.removeItem("firebaseToken");
//          dispatch(logout());
//          console.log("User signed out successfully");
//          return true;
//       } catch (error) {
//          console.error("Logout error:", error);
//          return false;
//       }
//    }

//    // UPDATED: Modified to handle redirect-based auth
//    static async handleAuthFlow(dispatch, user, userDetails, actions) {
//       console.log("handleAuthFlow called");

//       try {
//          // First, check for redirect result (user coming back from Google)
//          const redirectResult = await this.handleRedirectResult(
//             dispatch,
//             actions.setUser,
//             actions.setUserDetails
//          );

//          if (redirectResult) {
//             console.log("Authentication completed via redirect");
//             return redirectResult;
//          }

//          // Check if user is already logged in
//          if (user && user.uid) {
//             console.log("User already authenticated:", user.email);

//             // If no userDetails, try to fetch them
//             if (!userDetails) {
//                try {
//                   const details = await UserDetailsService.getUserDetails();
//                   if (details) {
//                      dispatch(actions.setUserDetails(details));
//                   }
//                } catch (error) {
//                   console.warn("Could not fetch user details:", error.message);
//                }
//             }

//             return { userData: user, details: userDetails };
//          }

//          // If no existing auth and no redirect result, initiate sign-in
//          console.log("No existing authentication, starting sign-in process...");
//          await this.signInWithGoogle(
//             dispatch,
//             actions.setUser,
//             actions.setUserDetails
//          );

//          // This return might not be reached due to redirect
//          return null;
//       } catch (error) {
//          console.error("Auth flow error:", error);
//          throw new Error(`Authentication failed: ${error.message}`);
//       }
//    }

//    // NEW: Set up auth state listener for redirect-based auth
//    static setupAuthStateListener(dispatch, setUser, setUserDetails) {
//       console.log("Setting up auth state listener...");

//       return onAuthStateChanged(auth, async (user) => {
//          if (user) {
//             console.log("Auth state changed - user signed in:", user.email);

//             // Get fresh token
//             const idToken = await user.getIdToken();
//             localStorage.setItem("firebaseToken", idToken);

//             const userData = {
//                email: user.email,
//                name: user.displayName,
//                picture: user.photoURL,
//                uid: user.uid,
//             };

//             dispatch(setUser(userData));

//             // Try to get user details
//             try {
//                const details = await UserDetailsService.getUserDetails();
//                if (details) {
//                   dispatch(setUserDetails(details));
//                }
//             } catch (error) {
//                console.warn(
//                   "Could not fetch user details on auth state change:",
//                   error.message
//                );
//             }
//          } else {
//             console.log("Auth state changed - user signed out");
//             localStorage.removeItem("firebaseToken");
//             // Don't dispatch logout here as it might cause loops
//          }
//       });
//    }

//    // Helper method to check if user needs phone number
//    static needsPhoneNumber(userDetails) {
//       return !userDetails?.phoneNumber;
//    }

//    // Helper method to check if user can place orders
//    static canPlaceOrders(userDetails) {
//       return userDetails?.phoneNumber && userDetails?.addresses?.length > 0;
//    }

//    // NEW: Check if we're waiting for redirect result
//    static isWaitingForRedirect() {
//       // You can set a flag in localStorage before redirect
//       return localStorage.getItem("authRedirectPending") === "true";
//    }

//    // NEW: Set redirect pending flag
//    static setRedirectPending() {
//       localStorage.setItem("authRedirectPending", "true");
//    }

//    // NEW: Clear redirect pending flag
//    static clearRedirectPending() {
//       localStorage.removeItem("authRedirectPending");
//    }
// }

// export default AuthService;

//The good news: we can fix both by using a free DNS alias like nip.io + Let’s Encrypt HTTPS. And don’t worry — this setup won’t block you later from switching to a real domain.
// When you get a proper domain, you’ll just swap out the server_name and re-run certbot. ✅

// OG sudo nano /etc/nginx/sites-available/default

// # Default server configuration
// #
//
