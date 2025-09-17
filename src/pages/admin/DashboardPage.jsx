"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, ShoppingCart, DollarSign, List } from "lucide-react";
import { useSelector } from "react-redux"; // Import useSelector

// Reusable card component for stats
// StatCard component remains the same...
const StatCard = ({ title, value, icon, color }) => (
   <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center">
         <div className={`p-3 rounded-full ${color}`}>{icon}</div>
         <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
         </div>
      </div>
   </div>
);

export default function DashboardPage() {
   const [stats, setStats] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   // Get the token from the Redux store
   const { token } = useSelector((state) => state.adminAuth);

   useEffect(() => {
      // Only fetch if the token is available
      if (!token) {
         setLoading(false);
         setError("Authentication token not found.");
         return;
      }

      const fetchStats = async () => {
         try {
            const response = await axios.get(
               "http://localhost:9999/api/admin/dashboard",
               {
                  headers: { Authorization: `Bearer ${token}` }, // Use the token from Redux
               }
            );
            setStats(response.data.data);
         } catch (err) {
            setError(err.message || "Failed to fetch dashboard data.");
         } finally {
            setLoading(false);
         }
      };

      fetchStats();
   }, [token]); // Re-run the effect if the token changes

   if (loading) return <div>Loading dashboard...</div>;
   if (error) return <div className="text-red-500">Error: {error}</div>;
   if (!stats) return <div>No data available.</div>;
   return (
      <div className="">
         <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

         <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
               title="Total Users"
               value={stats.totalUsers}
               icon={<Users className="text-white" size={24} />}
               color="bg-blue-500"
            />
            <StatCard
               title="Total Orders"
               value={stats.totalOrders}
               icon={<ShoppingCart className="text-white" size={24} />}
               color="bg-green-500"
            />
            <StatCard
               title="Total Revenue"
               value={`₹${stats.totalRevenue.toFixed(2)}`}
               icon={<DollarSign className="text-white" size={24} />}
               color="bg-yellow-500"
            />
            <StatCard
               title="Pending Orders"
               value={stats.pendingOrders}
               icon={<List className="text-white" size={24} />}
               color="bg-red-500"
            />
         </div>

         <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
            {/* Recent Orders Table */}
            <div className="p-6 bg-white rounded-lg shadow-md">
               <h2 className="text-xl font-semibold text-gray-700">
                  Recent Orders
               </h2>
               <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full">
                     <thead>
                        <tr>
                           <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                              Order ID
                           </th>
                           <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                              Customer
                           </th>
                           <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                              Status
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {stats.recentOrders.map((order) => (
                           <tr key={order._id} className="border-b">
                              <td className="px-4 py-2 text-sm text-gray-800">
                                 {order.orderNumber}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                 {order.userId.firstName}{" "}
                                 {order.userId.lastName}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                 <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                                    {order.orderStatus}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Top Selling Items */}
            <div className="p-6 bg-white rounded-lg shadow-md">
               <h2 className="text-xl font-semibold text-gray-700">
                  Top Selling Items
               </h2>
               <ul className="mt-4 space-y-2">
                  {stats.topCafeMenus.map((item) => (
                     <li
                        key={item._id}
                        className="flex justify-between p-2 rounded bg-gray-50"
                     >
                        <span className="text-sm font-medium text-gray-700">
                           {item.name}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                           {item.orderCount} orders
                        </span>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
   );
}
