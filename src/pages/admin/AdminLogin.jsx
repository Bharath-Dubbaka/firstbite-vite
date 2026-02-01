//src/pages/admin/AdminLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { adminLoginSuccess } from "@/store/slices/adminAuthSlice"; // Adjust path if needed
import { BASE_URL } from "../../lib/constants";

const API_URL = BASE_URL + "/admin/login";

export default function AdminLoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const router = useNavigate();
   const dispatch = useDispatch(); // Get the dispatch function

   const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         const response = await axios.post(API_URL, { email, password });
         if (response.data.success) {
            // Dispatch the action with the token and admin details
            dispatch(adminLoginSuccess(response.data));
            router("/admin/menu");
         } else {
            setError(response.data.error || "Login failed.");
         }
      } catch (err) {
         setError(
            err.response?.data?.error || "An error occurred. Please try again.",
         );
      } finally {
         setLoading(false);
      }
   };

   // ... (The rest of your JSX remains the same) ...
   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-800">
               Admin Login
            </h1>
            <form onSubmit={handleLogin} className="space-y-6">
               <div>
                  <label
                     htmlFor="email"
                     className="text-sm font-medium text-gray-700"
                  >
                     Email
                  </label>
                  <input
                     id="email"
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
               </div>
               <div>
                  <label
                     htmlFor="password"
                     className="text-sm font-medium text-gray-700"
                  >
                     Password
                  </label>
                  <input
                     id="password"
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
               </div>
               {error && <p className="text-sm text-red-600">{error}</p>}
               <div>
                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                  >
                     {loading ? "Logging in..." : "Login"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
