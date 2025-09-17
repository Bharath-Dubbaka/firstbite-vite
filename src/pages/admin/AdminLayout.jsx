import { useEffect } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogout } from "@/store/slices/adminAuthSlice"; // Adjust path
import { Shield, Home, Utensils, ShoppingCart, LogOut } from "lucide-react";

// NavLink component remains the same...
const NavLink = ({ href, icon, children }) => {
   const pathname = usePathname();
   const isActive = pathname === href;
   return (
      <Link href={href}>
         <span
            className={`flex items-center p-2 rounded-lg transition-colors ${
               isActive
                  ? "bg-indigo-700 text-white"
                  : "text-gray-300 hover:bg-indigo-500 hover:text-white"
            }`}
         >
            {icon}
            <span className="ml-3">{children}</span>
         </span>
      </Link>
   );
};

export default function AdminLayout({ children }) {
   const router = useNavigate();
   const dispatch = useDispatch();
   const { isAuthenticated, admin } = useSelector((state) => state.adminAuth);

   useEffect(() => {
      // If the state is not authenticated (after checking localStorage via getInitialState)
      // and we are not on the login page, redirect.
      if (!isAuthenticated && window.location.pathname !== "/admin/login") {
         router("/admin/login");
      }
   }, [isAuthenticated, router]);

   const handleLogout = () => {
      dispatch(adminLogout());
      router("/admin/login");
   };

   // Do not render layout on the login page itself to avoid nested structure
   if (useLocation() === "/admin/login") {
      return <>{children}</>;
   }

   // Show a loading state or null while authentication is being verified from the store
   if (!isAuthenticated) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            Verifying access...
         </div>
      );
   }

   return (
      <div className="md:mt-20 flex h-screen bg-gray-100">
         {/* Sidebar */}
         <aside className="hidden w-64 bg-indigo-600 text-white md:flex md:flex-col">
            <div className="flex flex-col items-center justify-center h-20 border-b border-indigo-500">
               <div className="flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  <span className="text-xl font-bold">Admin Panel</span>
               </div>
               <span className="text-sm mt-1 text-indigo-200">
                  Welcome, {admin?.name}
               </span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
               <NavLink href="/admin/dashboard" icon={<Home size={20} />}>
                  Dashboard
               </NavLink>
               <NavLink href="/admin/menu" icon={<Utensils size={20} />}>
                  Menu
               </NavLink>
               <NavLink href="/admin/orders" icon={<ShoppingCart size={20} />}>
                  Orders
               </NavLink>
            </nav>
            <div className="p-4 border-t border-indigo-500">
               <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-2 text-gray-300 rounded-lg hover:bg-indigo-500 hover:text-white"
               >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
               </button>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 overflow-y-auto bg-gray-200">
            <div className="container mx-auto px-6 py-8">
               <Outlet />
            </div>
         </main>
      </div>
   );
}
