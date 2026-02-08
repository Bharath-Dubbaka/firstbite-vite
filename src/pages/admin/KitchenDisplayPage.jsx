//src/pages/admin/KitchenDisplayPage.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";
import { toast } from "sonner";
import { Clock, Play } from "lucide-react";

export default function KitchenDisplayPage() {
   const [activeOrders, setActiveOrders] = useState([]);
   const [now, setNow] = useState(new Date());

   // Live timer update
   useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 60000); // Update every min
      return () => clearInterval(timer);
   }, []);

   const fetchKitchenOrders = async () => {
      try {
         const token = localStorage.getItem("adminToken");
         const res = await axios.get(
            `${BASE_URL}/admin/inhouse/kitchen-display`,
            {
               headers: { Authorization: `Bearer ${token}` },
            },
         );
         setActiveOrders(res.data.data);
      } catch (err) {
         console.error(err);
      }
   };

   useEffect(() => {
      fetchKitchenOrders();
      const interval = setInterval(fetchKitchenOrders, 30000); // Refresh every 30s
      return () => clearInterval(interval);
   }, []);

   const updateStatus = async (orderId, newStatus) => {
      try {
         const token = localStorage.getItem("adminToken");
         await axios.put(
            `${BASE_URL}/admin/inhouse/orders/${orderId}/status`,
            { status: newStatus, note: `Kitchen: Moved to ${newStatus}` },
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success(`Order is now ${newStatus.toUpperCase()}`);
         fetchKitchenOrders();
      } catch (err) {
         toast.error("Status update failed");
      }
   };

   const getTimeElapsed = (createdAt) => {
      const diff = Math.floor((now - new Date(createdAt)) / 60000);
      return diff < 1 ? "Just now" : `${diff}m ago`;
   };

   const markOrderAsReady = async (orderId) => {
      console.log(orderId, "Marking order ID");

      try {
         const token = localStorage.getItem("adminToken");
         // Use the generic order status update route you have in backend
         await axios.put(
            `${BASE_URL}/admin/inhouse/orders/${orderId}/status`,
            { status: "ready", note: "Prepared by kitchen" },
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success("Updated, Order marked as Ready!");
         fetchKitchenOrders(); // Refresh list
      } catch (err) {
         toast.error("Failed to update status");
      }
   };

   return (
      <div className="p-4 bg-slate-900 min-h-screen text-white">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
               <Clock /> KITCHEN QUEUE
            </h1>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeOrders.map((order) => (
               <div
                  key={order._id}
                  className={`bg-slate-800 rounded-lg border-l-4 overflow-hidden shadow-xl transition-colors ${
                     order.orderStatus === "preparing"
                        ? "border-blue-500 bg-slate-800"
                        : "border-orange-500"
                  }`}
               >
                  <div className="p-3 bg-slate-700 flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="font-bold text-lg">
                           Table {order.tableNumber}
                        </span>
                        <span className="text-[10px] text-orange-400 font-bold uppercase">
                           {getTimeElapsed(order.createdAt)}
                        </span>
                     </div>
                     <span className="text-xs font-mono text-slate-400">
                        #{order.orderNumber.slice(-4)}
                     </span>
                  </div>

                  <div className="p-4 space-y-3 min-h-[160px]">
                     {order.items.map((item, idx) => (
                        <div
                           key={idx}
                           className="flex justify-between border-b border-slate-700/50 pb-2"
                        >
                           <div className="flex-1">
                              <span className="text-xl font-bold text-white mr-2">
                                 {item.quantity} x
                              </span>
                              <span className="text-lg text-slate-200">
                                 {item.name}
                              </span>
                              {item.specialInstructions && (
                                 <p className="text-xs text-yellow-400 italic mt-1">
                                    Note: {item.specialInstructions}
                                 </p>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="p-3 bg-slate-900/30 flex gap-2">
                     {order.orderStatus !== "preparing" ? (
                        <button
                           onClick={() => updateStatus(order._id, "preparing")}
                           className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors"
                        >
                           <Play size={16} /> Start Cooking
                        </button>
                     ) : (
                        <button
                           onClick={() => updateStatus(order._id, "ready")}
                           className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors"
                        >
                           <CheckCircle size={16} /> Mark Ready
                        </button>
                     )}
                  </div>
               </div>
            ))}
         </div>
         {activeOrders.length === 0 && (
            <div className="text-center py-20 text-slate-500 italic">
               No active orders in the kitchen.
            </div>
         )}
      </div>
   );
}
