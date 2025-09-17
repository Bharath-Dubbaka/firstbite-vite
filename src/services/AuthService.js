// services/AuthService.js
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
         const name = result.user.displayName || result.user.email?.split("@")[0] || "User";

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
