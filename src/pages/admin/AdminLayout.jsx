// src/pages/admin/AdminLayout.jsx

import { useEffect, useState } from "react";

import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogout } from "@/store/slices/adminAuthSlice";
import {
   Shield,
   Utensils,
   ShoppingCart,
   LogOut,
   LayoutDashboard,
   Tablet,
   Monitor,
   Menu,
   X,
} from "lucide-react";

// Horizontal NavLink
const NavLink = ({ to, icon, children, onClick }) => {
   const location = useLocation();
   const isActive = location.pathname === to;

   return (
      <Link
         to={to}
         onClick={onClick}
         className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
            isActive
               ? "bg-white text-indigo-600 shadow"
               : "text-white hover:bg-indigo-500"
         }`}
      >
         {icon}
         <span className="ml-2">{children}</span>
      </Link>
   );
};

export default function AdminLayout() {
   const navigate = useNavigate();
   const location = useLocation();
   const dispatch = useDispatch();
   const { isAuthenticated, admin } = useSelector((state) => state.adminAuth);
   const [mobileOpen, setMobileOpen] = useState(false);

   useEffect(() => {
      if (!isAuthenticated && location.pathname !== "/admin/login") {
         navigate("/admin/login");
      }
   }, [isAuthenticated, location.pathname, navigate]);

   const handleLogout = () => {
      dispatch(adminLogout());
      navigate("/admin/login");
   };

   if (location.pathname === "/admin/login") {
      return <Outlet />;
   }

   if (!isAuthenticated) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            Verifying access...
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-100 font-elegant">
         {/* ✅ TOP HEADER */}
         <header className="bg-indigo-600 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6">
               <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <div className="flex items-center text-white">
                     <Shield className="w-6 h-6 mr-2" />
                     <span className="text-lg font-semibold">OMS</span>
                  </div>

                  {/* Desktop Nav */}
                  <nav className="hidden md:flex items-center space-x-1">
                     <NavLink to="/admin/menu" icon={<Utensils size={18} />}>
                        Menu
                     </NavLink>
                     <NavLink
                        to="/admin/orders"
                        icon={<ShoppingCart size={18} />}
                     >
                        Orders
                     </NavLink>
                     <NavLink
                        to="/admin/tables"
                        icon={<LayoutDashboard size={18} />}
                     >
                        Tables
                     </NavLink>
                     <NavLink to="/admin/pos" icon={<Tablet size={18} />}>
                        POS
                     </NavLink>
                     <NavLink to="/admin/kitchen" icon={<Monitor size={18} />}>
                        Kitchen
                     </NavLink>
                  </nav>

                  {/* Right Side */}
                  <div className="flex items-center space-x-4">
                     {/* Mobile Hamburger */}
                     <button
                        className="md:hidden text-white"
                        onClick={() => setMobileOpen(!mobileOpen)}
                     >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                     </button>

                     {/* Logout (Desktop Only) */}
                     <button
                        onClick={handleLogout}
                        className="hidden md:flex items-center px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 transition"
                     >
                        Logout
                     </button>
                  </div>
               </div>
            </div>

            {/* ✅ Mobile Dropdown */}
            {mobileOpen && (
               <div className="md:hidden bg-indigo-500 px-2 py-2 space-y-1">
                  <NavLink
                     to="/admin/menu"
                     icon={<Utensils size={18} />}
                     onClick={() => setMobileOpen(false)}
                  >
                     Menu
                  </NavLink>
                  <NavLink
                     to="/admin/orders"
                     icon={<ShoppingCart size={18} />}
                     onClick={() => setMobileOpen(false)}
                  >
                     Orders
                  </NavLink>
                  <NavLink
                     to="/admin/tables"
                     icon={<LayoutDashboard size={18} />}
                     onClick={() => setMobileOpen(false)}
                  >
                     Tables
                  </NavLink>
                  <NavLink
                     to="/admin/pos"
                     icon={<Tablet size={18} />}
                     onClick={() => setMobileOpen(false)}
                  >
                     POS
                  </NavLink>
                  <NavLink
                     to="/admin/kitchen"
                     icon={<Monitor size={18} />}
                     onClick={() => setMobileOpen(false)}
                  >
                     Kitchen
                  </NavLink>
                  <br />
                  <button
                     onClick={handleLogout}
                     className="w-full text-left text-gray-200 mt-6 underline hover:text-white transition"
                  >
                     LOGOUT
                  </button>
               </div>
            )}
         </header>

         {/* ✅ MAIN CONTENT */}
         <main className="container mx-auto px-6 py-8">
            <Outlet />
         </main>
      </div>
   );
}
