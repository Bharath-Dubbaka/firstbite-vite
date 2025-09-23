// components/AuthHandler.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AuthService from '../services/AuthService';
import { setUser } from '../store/slices/authSlice';
import { setUserDetails } from '../store/slices/firebaseSlice';

/**
 * AuthHandler component should be placed at the root level of your app
 * to handle authentication state changes and redirect results globally.
 * 
 * Usage in App.js:
 * import AuthHandler from './components/AuthHandler';
 * 
 * function App() {
 *   return (
 *     <div className="App">
 *       <AuthHandler />
 *       <Header />
 *       <Routes>
 *         ...your routes
 *       </Routes>
 *     </div>
 *   );
 * }
 */
const AuthHandler = () => {
   const dispatch = useDispatch();

   useEffect(() => {
      console.log("🔄 AuthHandler: Setting up global auth handling...");

      const initializeAuth = async () => {
         try {
            // Handle redirect result if present
            const redirectResult = await AuthService.handleRedirectResult(
               dispatch,
               setUser,
               setUserDetails
            );

            if (redirectResult) {
               console.log("✅ Global auth handler: Authentication successful");
               AuthService.clearRedirectPending();
            } else {
               console.log("ℹ️ Global auth handler: No redirect result found");
            }

         } catch (error) {
            console.error("❌ Global auth handler: Authentication failed:", error);
            AuthService.clearRedirectPending();
         }
      };

      initializeAuth();

      // Set up global auth state listener
      const unsubscribe = AuthService.setupAuthStateListener(
         dispatch,
         setUser,
         setUserDetails
      );

      // Cleanup function
      return () => {
         console.log("🧹 AuthHandler: Cleaning up auth listeners");
         unsubscribe();
      };

   }, [dispatch]);

   // This component doesn't render anything
   return null;
};

export default AuthHandler;