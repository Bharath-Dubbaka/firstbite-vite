// src/pages/admin/KitchenDisplayPage.jsx - ENHANCED VERSION
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";
import { toast } from "sonner";
import { Clock, Play, CheckCircle, ChefHat } from "lucide-react";

export default function KitchenDisplayPage() {
   const [activeOrders, setActiveOrders] = useState([]);
   const [now, setNow] = useState(new Date());

   useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 60000);
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
      const interval = setInterval(fetchKitchenOrders, 50000);
      return () => clearInterval(interval);
   }, []);

   // ✅ Update individual item status
   const updateItemStatus = async (orderId, itemId, newStatus) => {
      try {
         const token = localStorage.getItem("adminToken");
         await axios.put(
            `${BASE_URL}/admin/inhouse/orders/${orderId}/items/${itemId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success(`Item marked as ${newStatus.toUpperCase()}`);
         fetchKitchenOrders();
      } catch (err) {
         toast.error("Update failed");
      }
   };

   // ✅ Mark all items ready at once
   const markAllReady = async (orderId) => {
      try {
         const token = localStorage.getItem("adminToken");
         await axios.put(
            `${BASE_URL}/admin/inhouse/orders/${orderId}/mark-all-ready`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success("All items marked READY!");
         fetchKitchenOrders();
      } catch (err) {
         toast.error("Update failed");
      }
   };

   //getting from statusHistory
   const getTimeElapsed = (createdAt) => {
      const diff = Math.floor((now - new Date(createdAt)) / 60000);
      return diff < 1 ? "Just now" : `${diff}m ago`;
   };

   const getItemStatusColor = (status) => {
      const colors = {
         pending: "bg-slate-700 text-slate-300",
         preparing: "bg-blue-600 text-white",
         ready: "bg-green-600 text-white",
         served: "bg-gray-500 text-gray-300",
      };
      return colors[status] || "bg-slate-700";
   };

   return (
      <div className="p-4 bg-slate-100 min-h-screen text-white">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black uppercase tracking-widest text-orange-500 flex items-center gap-2 underline">
               <ChefHat size={28} /> KITCHEN QUEUE
            </h1>
            <button
               onClick={fetchKitchenOrders}
               className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
            >
               🔄 Refresh
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...activeOrders]
               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
               .map((order) => (
                  <div
                     key={order._id}
                     className="bg-slate-800 rounded-lg border-l-4 border-orange-500 overflow-hidden shadow-xl"
                  >
                     {/* Header */}
                     <div className="p-3 bg-slate-700 flex justify-between items-center">
                        <div className="flex flex-col">
                           <span className="font-bold text-lg">
                              {order.tableNumber
                                 ? `Table ${order.tableNumber}`
                                 : "Online Order"}
                           </span>
                           <span className="text-[10px] text-orange-400 font-bold uppercase">
                              {getTimeElapsed(order.createdAt)}
                           </span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                           #{order.orderNumber.slice(-4)}
                        </span>
                     </div>

                     {/* Items with individual controls */}
                     <div className="p-4 space-y-3 min-h-[200px]">
                        {[...order.items]
                           .sort(
                              (a, b) =>
                                 new Date(b.createdAt) - new Date(a.createdAt),
                           )
                           .map((item) => (
                              <div
                                 key={item._id}
                                 className="border border-slate-700 rounded-lg p-3 space-y-2"
                              >
                                 <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                       <span className="text-xl font-bold text-white mr-2">
                                          {item.quantity} x
                                       </span>
                                       <span className="text-base text-slate-200">
                                          {item.name}
                                       </span>
                                       {/* Show selected addons */}
                                       {item.selectedAddons &&
                                          item.selectedAddons.length > 0 && (
                                             <div className="mt-1 space-y-0.5">
                                                {item.selectedAddons.map(
                                                   (addon, i) => (
                                                      <p
                                                         key={i}
                                                         className="text-xs text-orange-300"
                                                      >
                                                         + {addon.name} (₹
                                                         {addon.price})
                                                      </p>
                                                   ),
                                                )}
                                             </div>
                                          )}
                                       {/* {getItemTimeElapsed(item.createdAt)} */}

                                       {item.specialInstructions && (
                                          <p className="text-xs text-yellow-400 italic mt-1">
                                             Note: {item.specialInstructions}
                                          </p>
                                       )}
                                    </div>
                                    <span
                                       className={`text-[10px] px-2 py-1 rounded ${getItemStatusColor(
                                          item.status,
                                       )}`}
                                    >
                                       {item.status.toUpperCase()}
                                    </span>
                                 </div>

                                 {/* Item-level controls */}
                                 <div className="flex gap-2">
                                    {item.status === "pending" && (
                                       <button
                                          onClick={() =>
                                             updateItemStatus(
                                                order._id,
                                                item._id,
                                                "preparing",
                                             )
                                          }
                                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-bold flex items-center justify-center gap-1"
                                       >
                                          <Play size={12} /> START
                                       </button>
                                    )}
                                    {item.status === "preparing" && (
                                       <button
                                          onClick={() =>
                                             updateItemStatus(
                                                order._id,
                                                item._id,
                                                "ready",
                                             )
                                          }
                                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded text-xs font-bold flex items-center justify-center gap-1"
                                       >
                                          <CheckCircle size={12} /> READY
                                       </button>
                                    )}
                                    {(item.status === "ready" ||
                                       item.status === "served") && (
                                       <div className="flex-1 py-2 bg-slate-700 rounded text-xs text-center text-slate-400">
                                          ✓ {item.status.toUpperCase()}
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))}
                     </div>

                     {/* Order-level bulk action */}
                     <div className="p-3 bg-slate-900/30 border-t border-slate-700">
                        {order.items.some(
                           (i) =>
                              i.status === "pending" ||
                              i.status === "preparing",
                        ) ? (
                           <button
                              onClick={() => markAllReady(order._id)}
                              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded text-sm font-bold uppercase flex items-center justify-center gap-2"
                           >
                              <CheckCircle size={16} /> MARK ALL READY
                           </button>
                        ) : (
                           <div className="text-center text-green-400 font-bold text-sm py-3">
                              ✓ ALL ITEMS READY
                           </div>
                        )}
                     </div>
                  </div>
               ))}
         </div>

         {activeOrders.length === 0 && (
            <div className="text-center py-20 text-slate-500 italic text-lg">
               No active orders in the kitchen.
            </div>
         )}
      </div>
   );
}
