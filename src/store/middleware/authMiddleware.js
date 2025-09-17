import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, setLoading } from "../slices/authSlice";
import { setUserDetails } from "../slices/firebaseSlice";
import { UserDetailsService } from "../../services/UserDetailsService";

let authListenerInitialized = false;

// Safe localStorage wrapper for SSR
const safeLocalStorage = {
   getItem: (key) => {
      if (typeof window !== "undefined") {
         return localStorage.getItem(key);
      }
      return null;
   },
   setItem: (key, value) => {
      if (typeof window !== "undefined") {
         localStorage.setItem(key, value);
      }
   },
   removeItem: (key) => {
      if (typeof window !== "undefined") {
         localStorage.removeItem(key);
      }
   },
};

const initializeAuthListener = (store) => {
   // Only initialize on client side
   if (typeof window === "undefined" || authListenerInitialized) return;

   authListenerInitialized = true;
   console.log("🔥 Initializing Firebase Auth Listener... (Client Side)");

   // Set initial loading state
   store.dispatch(setLoading(true));

   onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(
         "🔥 Auth State Changed:",
         firebaseUser ? "User logged in" : "User logged out"
      );

      if (firebaseUser) {
         try {
            const idToken = await firebaseUser.getIdToken(true);
            safeLocalStorage.setItem("firebaseToken", idToken);

            const userData = {
               email: firebaseUser.email,
               name: firebaseUser.displayName,
               picture: firebaseUser.photoURL,
               uid: firebaseUser.uid,
            };

            console.log("✅ Setting user data:", userData);
            store.dispatch(setUser(userData));

            // Fetch user details from backend
            try {
               const details = await UserDetailsService.getUserDetails();
               store.dispatch(setUserDetails(details));
               console.log("✅ User details loaded successfully");
            } catch (detailsError) {
               console.warn(
                  "Could not fetch user details:",
                  detailsError.message
               );
               store.dispatch(setUserDetails(null));
            }
         } catch (error) {
            console.error("❌ Error in auth state change:", error);
            store.dispatch(setUser(null));
            store.dispatch(setUserDetails(null));
         }
      } else {
         console.log("🚪 User logged out - clearing state");
         safeLocalStorage.removeItem("firebaseToken");
         store.dispatch(setUser(null));
         store.dispatch(setUserDetails(null));
      }

      store.dispatch(setLoading(false));
   });
};

// FIXED: Proper Redux middleware structure
export const createAuthMiddleware = (store) => (next) => (action) => {
   console.log("🔧 Middleware received action:", action.type);

   // Initialize auth listener when INIT_AUTH is dispatched
   if (
      typeof window !== "undefined" &&
      action.type === "INIT_AUTH" &&
      !authListenerInitialized
   ) {
      console.log("🎯 INIT_AUTH received - initializing auth listener");
      // Use setTimeout to ensure this runs after the current action
      setTimeout(() => initializeAuthListener(store), 0);
   }

   return next(action);
};
