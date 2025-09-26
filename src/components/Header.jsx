// import React, { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setUserDetails } from "../store/slices/firebaseSlice";
// import { setUser } from "../store/slices/authSlice";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Heart, LogOut } from "lucide-react";
// import { Button } from "./ui/button";
// import AuthService from "../services/AuthService";
// import { logout } from "../store/slices/authSlice";
// import { auth } from "../services/firebase";

// export default function Header() {
//    const [isMenuOpen, setIsMenuOpen] = useState(false);
//    const [isScrolled, setIsScrolled] = useState(false);
//    const [isLoading, setIsLoading] = useState(false);
//    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//    const dropdownRef = useRef(null);

//    const dispatch = useDispatch();
//    const { user, isAuthenticated, loading } = useSelector(
//       (state) => state.auth
//    );
//    const { userDetails } = useSelector((state) => state.firebase);

//    // Debug logging
//    useEffect(() => {
//       console.log("🎯 Header Re-render:", {
//          user,
//          isAuthenticated,
//          loading,
//          userDetails,
//          authCurrentUser: auth.currentUser?.email,
//       });
//    }, [user, isAuthenticated, loading, userDetails]);

//    // Token utility for development
//    useEffect(() => {
//       if (process.env.NODE_ENV === "development") {
//          window.getIdToken = async () => {
//             try {
//                const currentUser = auth.currentUser;
//                if (!currentUser) {
//                   console.warn("User not logged in.");
//                   return;
//                }
//                const token = await currentUser.getIdToken(true);
//                await navigator.clipboard.writeText(token);
//                console.log("✅ Firebase Token (copied to clipboard):", token);
//             } catch (error) {
//                console.error("❌ Failed to get token:", error);
//             }
//          };
//       }
//    }, []);

//    useEffect(() => {
//       const handleScroll = () => {
//          setIsScrolled(window.scrollY > 20);
//       };
//       window.addEventListener("scroll", handleScroll);
//       return () => window.removeEventListener("scroll", handleScroll);
//    }, []);

//    const navItems = [
//       { to: "/", label: "Home" },
//       { to: "/about", label: "About" },
//       { to: "/howitworks", label: "How it works" },
//       { to: "/bookus", label: "Book Us" },
//       { to: "/contact", label: "Contact" },
//    ];

//    const handleGetStarted = async () => {
//       console.log("🚀 Sign in/signup clicked");
//       try {
//          setIsLoading(true);
//          await AuthService.handleAuthFlow(dispatch, user, userDetails, {
//             setUser,
//             setUserDetails,
//          });
//       } catch (error) {
//          console.error("❌ Login error:", error);
//          alert("Auth error: " + error.message);
//       } finally {
//          setIsLoading(false);
//       }
//    };

//    const handleLogout = async () => {
//       try {
//          await AuthService.signOut(dispatch, logout);
//          localStorage.removeItem("firebaseToken");
//       } catch (error) {
//          console.error("❌ Logout error:", error);
//       }
//    };

//    // Show loading state
//    if (loading) {
//       return (
//          <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                <div className="flex items-center justify-between h-16 md:h-20">
//                   <div className="text-xl md:text-2xl font-bold">
//                      <span className="text-red-500">Love</span>
//                      <span className="text-green-700">@firstbite</span>
//                   </div>
//                   <div className="text-sm">Loading...</div>
//                </div>
//             </div>
//          </header>
//       );
//    }

//    return (
//       <header
//          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//             isScrolled
//                ? "bg-white/95 backdrop-blur-md shadow-lg"
//                : "bg-white/10 backdrop-blur-md"
//          }`}
//       >
//          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16 md:h-20">
//                {/* Logo */}
//                <Link to="/">
//                   <motion.div
//                      className="flex items-center space-x-2"
//                      initial={{ opacity: 0, x: -20 }}
//                      animate={{ opacity: 1, x: 0 }}
//                      transition={{ duration: 0.5 }}
//                   >
//                      <div className="text-2xl md:text-3xl">💝</div>
//                      <div className="text-xl md:text-2xl font-bold">
//                         <span className="text-red-500">Love</span>
//                         <span className="text-green-700">@firstbite</span>
//                      </div>
//                   </motion.div>
//                </Link>

//                {/* Desktop Navigation */}
//                <nav className="hidden lg:flex items-center space-x-8">
//                   {navItems.map((item, index) => (
//                      <motion.div
//                         key={item.to}
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: index * 0.1 }}
//                         whileHover={{ scale: 1.05 }}
//                      >
//                         <Link
//                            to={item.to}
//                            className="text-gray-700 hover:text-red-500 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
//                         >
//                            {item.label}
//                         </Link>
//                      </motion.div>
//                   ))}
//                </nav>

//                {/* DEBUG TOKEN BUTTON - REMOVE IN PRODUCTION */}
//                {/* {process.env.NODE_ENV === "development" && (
//                   <button
//                      onClick={() => {
//                         auth.currentUser
//                            ?.getIdToken(true)
//                            .then((token) => {
//                               console.log("Firebase Token:", token);
//                               navigator.clipboard.writeText(token).then(() => {
//                                  alert("Token copied to clipboard!");
//                               });
//                            })
//                            .catch((err) => {
//                               console.error("Token fetch failed:", err);
//                               alert("You must be logged in to get a token.");
//                            });
//                      }}
//                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
//                   >
//                      Copy Token
//                   </button>
//                )} */}

//                {/* Auth State Display */}
//                {isAuthenticated && user ? (
//                   <div className="flex items-center gap-1 md:gap-4 relative">
//                      {/* Profile Image */}
//                      {user.picture ? (
//                         <div className="flex items-center gap-2">
//                            <span className="text-sm text-gray-700">
//                               {user.name}
//                            </span>
//                            <img
//                               src={user.picture}
//                               alt={user.name}
//                               className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-indigo-200"
//                            />
//                         </div>
//                      ) : (
//                         <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs md:text-sm">
//                            {user.name?.charAt(0) || "U"}
//                         </div>
//                      )}

//                      {/* Dropdown Trigger */}
//                      <button
//                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                         className="p-1 hover:bg-indigo-100 rounded-full"
//                      >
//                         <svg
//                            className={`w-4 h-4 text-indigo-600 transition-transform duration-200 ${
//                               isDropdownOpen ? "rotate-180" : ""
//                            }`}
//                            fill="none"
//                            stroke="currentColor"
//                            viewBox="0 0 24 24"
//                         >
//                            <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 9l-7 7-7-7"
//                            />
//                         </svg>
//                      </button>

//                      {/* Dropdown Menu */}
//                      {isDropdownOpen && (
//                         <div
//                            ref={dropdownRef}
//                            className="absolute right-0 top-full mt-1 md:mt-2 w-64 md:w-80 bg-white rounded-lg shadow-lg border border-indigo-100 py-2 z-50"
//                         >
//                            <div className="px-4 py-2 border-b border-indigo-100">
//                               <p className="text-xs md:text-sm text-indigo-600">
//                                  Email: {user.email}
//                               </p>
//                               <p className="text-xs md:text-sm text-indigo-600">
//                                  ID: {user.uid}
//                               </p>
//                               <p className="border-t-2 text-xs md:text-sm px-2 pt-2 mt-2 hover:bg-red-50 flex items-center transition-colors duration-200 w-full py-2 text-left">
//                                  <Link
//                                     to={"/orders"}
//                                     className="text-gray-700 hover:text-blue-700  font-medium text-sm uppercase tracking-wide transition-colors duration-200"
//                                  >
//                                     My Orders
//                                  </Link>
//                               </p>
//                            </div>

//                            <button
//                               onClick={() => {
//                                  handleLogout();
//                                  setIsDropdownOpen(false);
//                               }}
//                               className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-200"
//                            >
//                               <LogOut className="w-4 h-4 mr-2" />
//                               Logout
//                            </button>
//                         </div>
//                      )}
//                   </div>
//                ) : (
//                   <div className="flex items-center space-x-4">
//                      <Button
//                         onClick={() => {
//                            console.log("🎯 Order Now clicked");
//                            setIsMenuOpen(false);
//                            handleGetStarted();
//                         }}
//                         disabled={isLoading}
//                      >
//                         <motion.div
//                            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
//                            initial={{ opacity: 0, x: 20 }}
//                            animate={{ opacity: 1, x: 0 }}
//                            transition={{ duration: 0.5 }}
//                            whileHover={{ scale: 1.05 }}
//                            whileTap={{ scale: 0.95 }}
//                         >
//                            <Heart className="w-4 h-4" />
//                            <span>{isLoading ? "Loading..." : "Order Now"}</span>
//                         </motion.div>
//                      </Button>

//                      {/* Mobile Menu Button */}
//                      <button
//                         className="lg:hidden p-2 rounded-md text-gray-700 hover:text-red-500 transition-colors"
//                         onClick={() => setIsMenuOpen(!isMenuOpen)}
//                      >
//                         {isMenuOpen ? (
//                            <X className="w-6 h-6" />
//                         ) : (
//                            <Menu className="w-6 h-6" />
//                         )}
//                      </button>
//                   </div>
//                )}
//             </div>
//          </div>

//          {/* Mobile Menu */}
//          <AnimatePresence>
//             {isMenuOpen && (
//                <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
//                >
//                   <div className="px-4 py-6 space-y-4">
//                      {navItems.map((item, index) => (
//                         <motion.div
//                            key={item.to}
//                            initial={{ opacity: 0, y: -20 }}
//                            animate={{ opacity: 1, y: 0 }}
//                            transition={{ duration: 0.5, delay: index * 0.1 }}
//                         >
//                            <Link
//                               to={item.to}
//                               className="block text-gray-700 hover:text-red-500 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
//                               onClick={() => setIsMenuOpen(false)}
//                            >
//                               {item.label}
//                            </Link>
//                         </motion.div>
//                      ))}

//                      {!isAuthenticated && (
//                         <Button
//                            onClick={() => {
//                               setIsMenuOpen(false);
//                               handleGetStarted();
//                            }}
//                            disabled={isLoading}
//                            className="w-full"
//                         >
//                            <motion.div
//                               className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold mt-4"
//                               initial={{ opacity: 0, y: 20 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ duration: 0.3, delay: 0.6 }}
//                            >
//                               <Heart className="w-4 h-4" />
//                               <span>
//                                  {isLoading ? "Loading..." : "Order Now"}
//                               </span>
//                            </motion.div>
//                         </Button>
//                      )}
//                   </div>
//                </motion.div>
//             )}
//          </AnimatePresence>
//       </header>
//    );
// }

//FOR PRODUCTION TESTING WITHOUT HTTPS

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../store/slices/firebaseSlice";
import { setUser } from "../store/slices/authSlice";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import AuthService from "../services/AuthService";
import { logout } from "../store/slices/authSlice";
import { auth } from "../services/firebase";

export default function Header() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [authError, setAuthError] = useState(null);
   const dropdownRef = useRef(null);

   const dispatch = useDispatch();
   const { user, isAuthenticated, loading } = useSelector(
      (state) => state.auth
   );
   const { userDetails } = useSelector((state) => state.firebase);

   // Debug logging
   useEffect(() => {
      console.log("🎯 Header Re-render:", {
         user,
         isAuthenticated,
         loading,
         userDetails,
         authCurrentUser: auth.currentUser?.email,
      });
   }, [user, isAuthenticated, loading, userDetails]);

   // 🆕 Handle redirect result on component mount
   useEffect(() => {
      const handleInitialAuth = async () => {
         console.log("🔄 Checking for redirect result on Header mount...");

         try {
            // Check for redirect result first
            const redirectResult = await AuthService.handleRedirectResult(
               dispatch,
               setUser,
               setUserDetails
            );

            if (redirectResult) {
               console.log("✅ Authentication completed via redirect");
               setAuthError(null);
            }
         } catch (error) {
            console.error("❌ Redirect authentication failed:", error);
            setAuthError(error.message);
         }
      };

      handleInitialAuth();

      // 🆕 Set up auth state listener
      const unsubscribe = AuthService.setupAuthStateListener(
         dispatch,
         setUser,
         setUserDetails
      );

      return () => unsubscribe();
   }, [dispatch]);

   // Token utility for development
   useEffect(() => {
      if (process.env.NODE_ENV === "development") {
         window.getIdToken = async () => {
            try {
               const currentUser = auth.currentUser;
               if (!currentUser) {
                  console.warn("User not logged in.");
                  return;
               }
               const token = await currentUser.getIdToken(true);
               await navigator.clipboard.writeText(token);
               console.log("✅ Firebase Token (copied to clipboard):", token);
            } catch (error) {
               console.error("❌ Failed to get token:", error);
            }
         };
      }
   }, []);

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const navItems = [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/howitworks", label: "How it works" },
      { to: "/bookus", label: "Book Us" },
      { to: "/contact", label: "Contact" },
   ];

   // 🆕 Updated to handle redirect-based auth
   const handleGetStarted = async () => {
      console.log("🚀 Sign in/signup clicked");
      try {
         setIsLoading(true);
         setAuthError(null);

         // Check if user is already authenticated
         if (user && user.uid) {
            console.log("✅ User already authenticated");
            return;
         }

         // Set redirect pending flag
         AuthService.setRedirectPending();

         // This will redirect the user away from the current page
         await AuthService.signInWithGoogle(dispatch, setUser, setUserDetails);

         // Code after this won't execute due to redirect
      } catch (error) {
         console.error("❌ Login error:", error);
         setAuthError(error.message);
         AuthService.clearRedirectPending();
         setIsLoading(false);
      }
   };

   const handleLogout = async () => {
      try {
         await AuthService.signOut(dispatch, logout);
         localStorage.removeItem("firebaseToken");
         setAuthError(null);
      } catch (error) {
         console.error("❌ Logout error:", error);
         setAuthError("Logout failed. Please try again.");
      }
   };

   // 🆕 Show loading state if waiting for redirect
   if (loading || AuthService.isWaitingForRedirect()) {
      return (
         <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-16 md:h-20">
                  <div className="text-xl md:text-2xl font-bold">
                     <span className="text-red-500">Love</span>
                     <span className="text-green-700">@firstbite</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                     <div className="text-sm">
                        Authenticating with Google...
                     </div>
                  </div>
               </div>
            </div>
         </header>
      );
   }

   return (
      <header
         className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            isScrolled
               ? "bg-white/95 backdrop-blur-md shadow-lg"
               : "bg-white/10 backdrop-blur-md"
         }`}
      >
         {/* 🆕 Auth Error Banner */}
         {authError && (
            <div className="bg-red-100 border-b border-red-200 px-4 py-2">
               <div className="max-w-7xl mx-auto">
                  <p className="text-sm text-red-700 flex items-center justify-between">
                     <span>{authError}</span>
                     <button
                        onClick={() => setAuthError(null)}
                        className="text-red-500 hover:text-red-700"
                     >
                        ×
                     </button>
                  </p>
               </div>
            </div>
         )}

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
               {/* Logo */}
               <Link to="/">
                  <motion.div
                     className="flex items-center space-x-2"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.5 }}
                  >
                     <div className="text-2xl md:text-3xl">💝</div>
                     <div className="text-xl md:text-2xl font-bold">
                        <span className="text-red-500">Love</span>
                        <span className="text-green-700">@firstbite</span>
                     </div>
                  </motion.div>
               </Link>

               {/* Desktop Navigation */}
               <nav className="hidden lg:flex items-center space-x-8">
                  {navItems.map((item, index) => (
                     <motion.div
                        key={item.to}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                     >
                        <Link
                           to={item.to}
                           className="text-gray-700 hover:text-red-500 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
                        >
                           {item.label}
                        </Link>
                     </motion.div>
                  ))}
               </nav>

               {/* Auth State Display */}
               {isAuthenticated && user ? (
                  <div className="flex items-center gap-1 md:gap-4 relative">
                     {/* Profile Image */}
                     {user.picture ? (
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-gray-700">
                              {user.name}
                           </span>
                           <img
                              src={user.picture}
                              alt={user.name}
                              className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-indigo-200"
                           />
                        </div>
                     ) : (
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs md:text-sm">
                           {user.name?.charAt(0) || "U"}
                        </div>
                     )}

                     {/* Dropdown Trigger */}
                     <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="p-1 hover:bg-indigo-100 rounded-full"
                     >
                        <svg
                           className={`w-4 h-4 text-indigo-600 transition-transform duration-200 ${
                              isDropdownOpen ? "rotate-180" : ""
                           }`}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                           />
                        </svg>
                     </button>

                     {/* Dropdown Menu */}
                     {isDropdownOpen && (
                        <div
                           ref={dropdownRef}
                           className="absolute right-0 top-full mt-1 md:mt-2 w-64 md:w-80 bg-white rounded-lg shadow-lg border border-indigo-100 py-2 z-50"
                        >
                           <div className="px-4 py-2 border-b border-indigo-100">
                              <p className="text-xs md:text-sm text-indigo-600">
                                 Email: {user.email}
                              </p>
                              <p className="text-xs md:text-sm text-indigo-600">
                                 ID: {user.uid}
                              </p>
                              <p className="border-t-2 text-xs md:text-sm px-2 pt-2 mt-2 hover:bg-red-50 flex items-center transition-colors duration-200 w-full py-2 text-left">
                                 <Link
                                    to={"/orders"}
                                    className="text-gray-700 hover:text-blue-700  font-medium text-sm uppercase tracking-wide transition-colors duration-200"
                                 >
                                    My Orders
                                 </Link>
                              </p>
                           </div>

                           <button
                              onClick={() => {
                                 handleLogout();
                                 setIsDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-200"
                           >
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="flex items-center space-x-4">
                     <Button
                        onClick={() => {
                           console.log("🎯 Order Now clicked");
                           setIsMenuOpen(false);
                           handleGetStarted();
                        }}
                        disabled={isLoading}
                     >
                        <motion.div
                           className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.5 }}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                        >
                           <Heart className="w-4 h-4" />
                           <span>{isLoading ? "Loading..." : "Order Now"}</span>
                        </motion.div>
                     </Button>

                     {/* Mobile Menu Button */}
                     <button
                        className="lg:hidden p-2 rounded-md text-gray-700 hover:text-red-500 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                     >
                        {isMenuOpen ? (
                           <X className="w-6 h-6" />
                        ) : (
                           <Menu className="w-6 h-6" />
                        )}
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* Mobile Menu */}
         <AnimatePresence>
            {isMenuOpen && (
               <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
               >
                  <div className="px-4 py-6 space-y-4">
                     {navItems.map((item, index) => (
                        <motion.div
                           key={item.to}
                           initial={{ opacity: 0, y: -20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                           <Link
                              to={item.to}
                              className="block text-gray-700 hover:text-red-500 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
                              onClick={() => setIsMenuOpen(false)}
                           >
                              {item.label}
                           </Link>
                        </motion.div>
                     ))}

                     {!isAuthenticated && (
                        <Button
                           onClick={() => {
                              setIsMenuOpen(false);
                              handleGetStarted();
                           }}
                           disabled={isLoading}
                           className="w-full"
                        >
                           <motion.div
                              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold mt-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.6 }}
                           >
                              <Heart className="w-4 h-4" />
                              <span>
                                 {isLoading ? "Loading..." : "Order Now"}
                              </span>
                           </motion.div>
                        </Button>
                     )}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </header>
   );
}
