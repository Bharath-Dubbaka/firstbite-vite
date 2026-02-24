//src/pages/admin/OrderManagementPage.jsx

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { BASE_URL } from "../../lib/constants";
import { toast } from "sonner";
import { Receipt, Printer, CreditCard, Eye, X } from "lucide-react";
import { PrintableBill } from "./PrintableBill";

const OrderTimeline = ({ order }) => {
   // Combine order-level and item-level events
   const events = [
      ...order.statusHistory.map((h) => ({
         type: h.status.startsWith("item_") ? "item" : "order",
         status: h.status.replace("item_", ""),
         timestamp: h.timestamp,
         note: h.note,
      })),
   ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
   return (
      <div className="mt-4 border-t pt-4">
         <h4
            className="font-semibold mb-3 text-md
         "
         >
            Activity Timeline
         </h4>
         <div className="space-y-2 max-h-60 overflow-y-auto">
            {/* {console.log(events, "EVENTs ")} */}
            {events.map((event, idx) => (
               <div
                  key={idx}
                  className="flex gap-3 text-sm border-l-2 border-gray-300 pl-3 py-1"
               >
                  <div className="flex-1">
                     <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                           event.type === "item"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                     >
                        {event.type === "item" ? "ITEM" : "ORDER"}
                     </span>
                     <span className="ml-2 capitalize">
                        {event.status.replace("-", " ")}
                     </span>
                     {event.note && (
                        <p className="text-gray-500 mt-0.5">{event.note}</p>
                     )}
                  </div>
                  <span className="text-gray-400 text-[10px] align-top">
                     {new Date(event.timestamp).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                     })}
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
};

export default function OrderManagementPage() {
   const [orders, setOrders] = useState([]);
   const [filteredOrders, setFilteredOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [selectedOrder, setSelectedOrder] = useState(null);
   const [showModal, setShowModal] = useState(false);

   // Filter and Search states
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("all");
   const [paymentFilter, setPaymentFilter] = useState("all");
   const [dateFilter, setDateFilter] = useState("all");
   const [sortBy, setSortBy] = useState("newest");
   const [isGenerating, setIsGenerating] = useState(false);
   const componentRef = useRef(null);
   const [showFilters, setShowFilters] = useState(false);

   // Define separate options
   const onlineStatusOptions = [
      "placed",
      "confirmed",
      "preparing",
      "ready",
      "dispatched",
      "delivered",
      "cancelled",
   ];
   const inhouseStatusOptions = [
      "confirmed",
      "preparing",
      "ready",
      "served",
      "billing",
      "completed",
      "cancelled",
   ];

   const API_BASE_URL = BASE_URL + "/admin/orders";

   const handlePrint = useReactToPrint({
      contentRef: componentRef,
   });

   // Helper function  Smart Action Buttons
   const getOrderActions = (order) => {
      // ✅ CRITICAL FIX: Check payment status FIRST
      if (order.paymentStatus === "completed") {
         return {
            message: "✅ Paid & Closed",
            canGenerateBill: false,
            canPrint: true,
            canPay: false,
         };
      }

      // ✅ FIX: For in-house orders
      if (order.orderSource === "in-house") {
         const allItemsServed = order.items?.every(
            (i) => i.status === "served",
         );
         const hasPendingItems = order.items?.some(
            (i) => i.status === "pending",
         );

         // Case 1: Has pending items (new items added after billing)
         if (hasPendingItems) {
            return {
               message: "⚠️ New items pending - serve before billing",
               canGenerateBill: false,
               canPrint: false,
               canPay: false,
            };
         }

         // Case 2: Not all items served yet
         if (!allItemsServed) {
            return {
               message: "⚠️ All items must be served before billing",
               canGenerateBill: false,
               canPrint: false,
               canPay: false,
            };
         }

         // Case 3: All served, bill not generated OR bill needs regeneration
         if (
            allItemsServed &&
            (!order.billGenerated || order.orderStatus !== "billing")
         ) {
            return {
               message: "✅ Ready to generate bill",
               canGenerateBill: true,
               canPrint: false,
               canPay: false,
               nextStep: "Generate bill first",
            };
         }

         // Case 4: Bill generated (status is "billing")
         if (order.orderStatus === "billing" && order.billGenerated) {
            return {
               message: "✅ Bill generated - Print and collect payment",
               canGenerateBill: true, // Allow regeneration
               canPrint: true,
               canPay: true,
               nextStep: "Print bill, then accept payment",
            };
         }

         // Case 5: Served but somehow not in billing
         if (allItemsServed) {
            return {
               message: "✅ Ready for billing",
               canGenerateBill: true,
               canPrint: false,
               canPay: false,
            };
         }
      }

      // Default fallback
      return {
         message: "",
         canGenerateBill: false,
         canPrint: false,
         canPay: false,
      };
   };

   // Helper to make the UI look nice while keeping DB values clean
   const getDisplayStatus = (status, source) => {
      if (source === "in-house") {
         const statusMap = {
            confirmed: "CONFIRMED",
            preparing: "PREPARING",
            ready: "READY TO SERVE",
            served: "SERVED",
            billing: "BILLING", // ✅ Fixed
            completed: "PAID & CLOSED",
            cancelled: "CANCELLED",
         };
         return statusMap[status] || status.toUpperCase();
      }
      return status.toUpperCase().replace("-", " ");
   };

   const generateBill = async (orderId) => {
      setIsGenerating(true);
      try {
         const token = localStorage.getItem("adminToken");
         const res = await axios.post(
            `${BASE_URL}/admin/inhouse/${orderId}/generate-bill`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
         );

         toast.success("Bill generated successfully!");
         fetchOrders(); // Refresh to show the Print button
      } catch (err) {
         toast.error(err.response?.data?.error || "Billing failed");
      } finally {
         setIsGenerating(false);
      }
   };

   const handleCompletePayment = async (orderId, method) => {
      try {
         const token = localStorage.getItem("adminToken");
         await axios.post(
            `${BASE_URL}/admin/inhouse/${orderId}/complete-payment`,
            { paymentMethod: method },
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success(`Paid via ${method.toUpperCase()}. Table is now FREE!`);
         fetchOrders();
      } catch (err) {
         toast.error("Payment recording failed");
      }
   };

   const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
         const token = localStorage.getItem("adminToken");
         const response = await axios.get(API_BASE_URL, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setOrders(response.data.data);
         setFilteredOrders(response.data.data);
      } catch (err) {
         setError("Failed to fetch orders.");
         console.error("Fetch orders error:", err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchOrders();
   }, []);

   // Filter and sort orders
   useEffect(() => {
      let filtered = [...orders];

      // Search filter
      if (searchTerm) {
         filtered = filtered.filter(
            (order) =>
               order.orderNumber
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               order.userId?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               order.userId?.email
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()),
         );
      }

      // Status filter
      if (statusFilter !== "all") {
         filtered = filtered.filter(
            (order) => order.orderStatus === statusFilter,
         );
      }

      // Payment filter
      if (paymentFilter !== "all") {
         filtered = filtered.filter(
            (order) => order.paymentStatus === paymentFilter,
         );
      }

      // Date filter
      if (dateFilter !== "all") {
         const now = new Date();
         const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
         );
         const yesterday = new Date(today);
         yesterday.setDate(yesterday.getDate() - 1);
         const weekAgo = new Date(today);
         weekAgo.setDate(weekAgo.getDate() - 7);
         const monthAgo = new Date(today);
         monthAgo.setMonth(monthAgo.getMonth() - 1);

         filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            switch (dateFilter) {
               case "today":
                  return orderDate >= today;
               case "yesterday":
                  return orderDate >= yesterday && orderDate < today;
               case "week":
                  return orderDate >= weekAgo;
               case "month":
                  return orderDate >= monthAgo;
               default:
                  return true;
            }
         });
      }

      // Sort
      filtered.sort((a, b) => {
         switch (sortBy) {
            case "newest":
               return new Date(b.createdAt) - new Date(a.createdAt);
            case "oldest":
               return new Date(a.createdAt) - new Date(b.createdAt);
            case "amount_high":
               return b.finalAmount - a.finalAmount;
            case "amount_low":
               return a.finalAmount - b.finalAmount;
            case "order_number":
               return a.orderNumber.localeCompare(b.orderNumber);
            default:
               return 0;
         }
      });

      setFilteredOrders(filtered);
   }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortBy]);

   const handleStatusChange = async (orderId, newStatus) => {
      try {
         const token = localStorage.getItem("adminToken");
         await axios.put(
            `${API_BASE_URL}/${orderId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } },
         );
         fetchOrders(); // Refresh data
      } catch (err) {
         setError("Failed to update order status.");
         console.error("Status update error:", err);
      }
   };

   const handleItemStatusChange = async (orderId, itemId, newStatus) => {
      try {
         const token = localStorage.getItem("adminToken");
         await axios.put(
            `${BASE_URL}/admin/inhouse/orders/${orderId}/items/${itemId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } },
         );

         toast.success(`Item marked as ${newStatus}`);

         // Refresh order details
         handleViewDetails(orderId);

         // Refresh orders list
         fetchOrders();
      } catch (err) {
         toast.error("Failed to update item status");
         console.error(err);
      }
   };

   const handleMarkAllItemsReady = async (orderId) => {
      try {
         const token = localStorage.getItem("adminToken");
         await axios.put(
            `${BASE_URL}/admin/inhouse/orders/${orderId}/mark-all-ready`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
         );

         toast.success("All items marked as ready");

         // Refresh order details
         handleViewDetails(orderId);

         // Refresh orders list
         fetchOrders();
      } catch (err) {
         toast.error("Failed to mark items as ready");
         console.error(err);
      }
   };

   const handleMarkAllItemsServed = async (orderId) => {
      try {
         const token = localStorage.getItem("adminToken");

         // Get current order
         const response = await axios.get(
            `${BASE_URL}/admin/orders/${orderId}`,
            { headers: { Authorization: `Bearer ${token}` } },
         );

         const order = response.data.data || response.data;

         // Update each item to served
         for (const item of order.items) {
            if (item.status !== "served") {
               await axios.put(
                  `${BASE_URL}/admin/inhouse/orders/${orderId}/items/${item._id}/status`,
                  { status: "served" },
                  { headers: { Authorization: `Bearer ${token}` } },
               );
            }
         }

         toast.success("All items marked as served");

         // Refresh order details
         handleViewDetails(orderId);

         // Refresh orders list
         fetchOrders();
      } catch (err) {
         toast.error("Failed to mark items as served");
         console.error(err);
      }
   };

   const handleViewDetails = async (orderId) => {
      try {
         console.log("Fetching order details for ID:", orderId); // Debug log
         const token = localStorage.getItem("adminToken");
         console.log("Using admin token:", token ? "Token exists" : "No token"); // Debug log

         const response = await axios.get(
            `${BASE_URL}/admin/orders/${orderId}`,
            {
               headers: { Authorization: `Bearer ${token}` },
            },
         );

         console.log("Order details response:", response.data); // Debug log
         setSelectedOrder(response.data.data || response.data); // Handle both formats
         setShowModal(true);
      } catch (err) {
         console.error("Failed to fetch order details:", err);
         console.error("Error response:", err.response?.data); // Debug log
         setError("Failed to fetch order details.");
      }
   };

   const getStatusColor = (status) => {
      const colors = {
         placed: "bg-blue-100 text-blue-800",
         confirmed: "bg-yellow-100 text-yellow-800",
         preparing: "bg-orange-100 text-orange-800",
         ready: "bg-purple-100 text-purple-800",
         dispatched: "bg-indigo-100 text-indigo-800",
         delivered: "bg-green-100 text-green-800",
         cancelled: "bg-red-100 text-red-800",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
   };

   const getPaymentStatusColor = (status) => {
      const colors = {
         pending: "bg-yellow-100 text-yellow-800",
         completed: "bg-green-100 text-green-800",
         failed: "bg-red-100 text-red-800",
         refunded: "bg-gray-100 text-gray-800",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
   };

   const statusOptions = [
      "placed",
      "confirmed",
      "preparing",
      "ready",
      "dispatched",
      "delivered",
      "cancelled",
   ];
   const paymentStatusOptions = [
      "all",
      "pending",
      "completed",
      "failed",
      "refunded",
   ];

   const clearFilters = () => {
      setSearchTerm("");
      setStatusFilter("all");
      setPaymentFilter("all");
      setDateFilter("all");
      setSortBy("newest");
   };

   return (
      <div className="p-2 md:p-2 lg:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
               <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Order Management
               </h1>
               <p
                  className="text-md
                text-gray-500 mt-1"
               >
                  Total Orders: {filteredOrders.length}
               </p>
            </div>

            <button
               onClick={fetchOrders}
               className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
            >
               🔄 Refresh
            </button>
         </div>

         {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
               {error}
            </div>
         )}

         {/* Filters and Search */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
               {/* Search */}
               <div className="lg:col-span-2">
                  <label
                     className="block text-md
                   font-medium text-gray-700 mb-2"
                  >
                     Search Orders
                  </label>
                  <input
                     type="text"
                     placeholder="Search by order #, customer name, email..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
               </div>

               {/* Status Filter */}
               {/* Filter Toggle for Mobile */}
               <div className="md:hidden mb-3">
                  <button
                     onClick={() => setShowFilters(!showFilters)}
                     className="w-full bg-gray-200 py-2 rounded-md text-md
                      font-medium"
                  >
                     {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>

                  {/* Filters */}
                  <div
                     className={`${showFilters ? "block" : "hidden"} md:block bg-white rounded-lg shadow-md p-6 mb-6`}
                  >
                     <div>
                        <label
                           className="block text-md
                         font-medium text-gray-700 mb-2"
                        >
                           Order Status
                        </label>
                        <select
                           value={statusFilter}
                           onChange={(e) => setStatusFilter(e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                           <option value="all">All Status</option>
                           {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                 {status.replace("-", " ").toUpperCase()}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>
               </div>

               {/* Payment Filter */}
               <div>
                  <label
                     className="block text-md
                   font-medium text-gray-700 mb-2"
                  >
                     Payment Status
                  </label>
                  <select
                     value={paymentFilter}
                     onChange={(e) => setPaymentFilter(e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                     {paymentStatusOptions.map((status) => (
                        <option key={status} value={status}>
                           {status === "all"
                              ? "All Payments"
                              : status.toUpperCase()}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Date Filter */}
               <div>
                  <label
                     className="block text-md
                   font-medium text-gray-700 mb-2"
                  >
                     Date Range
                  </label>
                  <select
                     value={dateFilter}
                     onChange={(e) => setDateFilter(e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                     <option value="all">All Time</option>
                     <option value="today">Today</option>
                     <option value="yesterday">Yesterday</option>
                     <option value="week">Last Week</option>
                     <option value="month">Last Month</option>
                  </select>
               </div>

               {/* Sort */}
               <div>
                  <label
                     className="block text-md
                   font-medium text-gray-700 mb-2"
                  >
                     Sort By
                  </label>
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                     <option value="newest">Newest First</option>
                     <option value="oldest">Oldest First</option>
                     <option value="amount_high">Amount: High to Low</option>
                     <option value="amount_low">Amount: Low to High</option>
                     <option value="order_number">Order Number</option>
                  </select>
               </div>
            </div>

            <div className="mt-4 flex justify-end">
               <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 text-md
                   underline"
               >
                  Clear All Filters
               </button>
            </div>
         </div>

         {loading ? (
            <div className="text-center py-8">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
         ) : (
            <div className="bg-white rounded-lg shadow-md">
               {/* ================= MOBILE CARD VIEW ================= */}
               <div className="md:hidden divide-y">
                  {filteredOrders.map((order) => {
                     const actions = getOrderActions(order);

                     return (
                        <div key={order._id} className="p-4 space-y-3">
                           {/* Top Row */}
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="font-semibold text-gray-900">
                                    #{order.orderNumber}
                                 </p>
                                 <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleString(
                                       "en-IN",
                                    )}
                                 </p>
                              </div>

                              <p className="font-bold text-indigo-600">
                                 ₹{order.finalAmount}
                              </p>
                           </div>

                           {/* Customer */}
                           <div
                              className="text-md
                            text-gray-600"
                           >
                              {order.userId?.name || "N/A"}
                           </div>

                           {/* Status + Payment */}
                           <div className="flex justify-between items-center">
                              <span
                                 className={`px-2 py-1 text-sm rounded-full ${getStatusColor(
                                    order.orderStatus,
                                 )}`}
                              >
                                 {getDisplayStatus(
                                    order.orderStatus,
                                    order.orderSource,
                                 )}
                              </span>

                              <span
                                 className={`px-2 py-1 text-sm rounded-full ${getPaymentStatusColor(
                                    order.paymentStatus,
                                 )}`}
                              >
                                 {order.paymentStatus?.toUpperCase()}
                              </span>
                           </div>

                           {/* Actions */}
                           <div className="flex flex-col gap-2 pt-2 border-t">
                              <button
                                 onClick={() => handleViewDetails(order._id)}
                                 className="bg-gray-100 text-gray-800 py-2 rounded-md text-md
                                 "
                              >
                                 👁 View Details
                              </button>

                              {/* In-house flow */}
                              {order.orderSource === "in-house" && (
                                 <>
                                    {actions.message && (
                                       <div className="text-[11px] text-gray-500 text-center">
                                          {actions.message}
                                       </div>
                                    )}

                                    {actions.canGenerateBill && (
                                       <button
                                          onClick={() =>
                                             generateBill(order._id)
                                          }
                                          className="bg-orange-500 text-white py-2 rounded-md text-md
                                          "
                                       >
                                          {order.billGenerated
                                             ? "Regenerate Bill"
                                             : "Generate Bill"}
                                       </button>
                                    )}

                                    {actions.canPrint && (
                                       <button
                                          onClick={async () => {
                                             try {
                                                const token =
                                                   localStorage.getItem(
                                                      "adminToken",
                                                   );

                                                // ✅ Use the inhouse route for in-house orders
                                                const endpoint =
                                                   order.orderSource ===
                                                   "in-house"
                                                      ? `${BASE_URL}/admin/inhouse/orders/${order._id}`
                                                      : `${BASE_URL}/admin/orders/${order._id}`;

                                                const response =
                                                   await axios.get(endpoint, {
                                                      headers: {
                                                         Authorization: `Bearer ${token}`,
                                                      },
                                                   });

                                                setSelectedOrder(
                                                   response.data.data ||
                                                      response.data,
                                                );
                                                setTimeout(
                                                   () => handlePrint(),
                                                   150,
                                                );
                                             } catch (err) {
                                                toast.error(
                                                   "Failed to load order for printing",
                                                );
                                             }
                                          }}
                                          className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1 justify-center hover:bg-indigo-700"
                                       >
                                          <Printer size={12} /> PRINT BILL
                                       </button>
                                    )}

                                    {actions.canPay && (
                                       <div className="grid grid-cols-2 gap-2">
                                          <button
                                             onClick={() =>
                                                handleCompletePayment(
                                                   order._id,
                                                   "cash",
                                                )
                                             }
                                             className="bg-green-600 text-white py-2 rounded-md text-sm"
                                          >
                                             Cash
                                          </button>
                                          <button
                                             onClick={() =>
                                                handleCompletePayment(
                                                   order._id,
                                                   "upi",
                                                )
                                             }
                                             className="bg-blue-600 text-white py-2 rounded-md text-sm"
                                          >
                                             UPI
                                          </button>
                                       </div>
                                    )}
                                 </>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>

               {/* ================= DESKTOP TABLE VIEW ================= */}
               <div className="hidden md:block">
                  <table className="w-full table-fixed">
                     <thead className="bg-gray-50 ">
                        <tr>
                           <th className="px-6 py-3 text-left w-[20%] text-sm font-bold text-gray-500 uppercase tracking-wider">
                              Order Details
                           </th>
                           <th className="px-6 py-3 text-left  w-[10%] text-sm font-bold text-gray-500 uppercase tracking-wider">
                              Cus
                           </th>
                           <th className="px-6 py-3 text-left  w-[10%] text-sm font-bold text-gray-500 uppercase tracking-wider">
                              Items & Amt
                           </th>
                           <th className="px-6 py-3 text-left w-[30%] text-sm font-bold text-gray-500 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-3 text-left w-[30%] text-sm font-bold text-gray-500 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                           <tr key={order._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 align-top">
                                 <div>
                                    <div
                                       className="text-md
                                     font-medium text-gray-900"
                                    >
                                       #{order.orderNumber}
                                    </div>
                                    <div
                                       className="text-md
                                     text-gray-500"
                                    >
                                       {new Date(
                                          order.createdAt,
                                       ).toLocaleDateString("en-IN", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                       })}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                       {order.paymentMethod
                                          ?.replace("_", " ")
                                          .toUpperCase()}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 align-top">
                                 <div>
                                    <div
                                       className="text-md
                                     font-medium text-gray-900"
                                    >
                                       {order.userId?.name || "N/A"}
                                    </div>
                                    <div
                                       className="text-md
                                     text-gray-500"
                                    >
                                       {order.userId?.email || "N/A"}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                       {order.deliveryAddress?.city},{" "}
                                       {order.deliveryAddress?.pincode}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 align-top">
                                 <div>
                                    <div
                                       className="text-md
                                     font-medium text-gray-900 "
                                    >
                                       ₹{order.finalAmount}
                                    </div>
                                    <div
                                       className="text-md
                                     text-gray-500"
                                    >
                                       {order.items?.length || 0} item
                                       {order.items?.length !== 1 ? "s" : ""}
                                    </div>
                                    {order.deliveryCharges > 0 && (
                                       <div className="text-sm text-gray-400">
                                          +₹{order.deliveryCharges} delivery
                                       </div>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-4 align-top">
                                 <div className="space-y-2">
                                    {/* with dropdown to change status for in-house orders   */}
                                    {/* <select
                                       value={order.orderStatus}
                                       onChange={(e) =>
                                          handleStatusChange(
                                             order._id,
                                             e.target.value,
                                          )
                                       }
                                       className={`text-sm font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(
                                          order.orderStatus,
                                       )}`}
                                    >
                                       {(order.orderSource === "in-house"
                                          ? inhouseStatusOptions
                                          : onlineStatusOptions
                                       ).map((status) => (
                                          <option key={status} value={status}>
                                             {getDisplayStatus(
                                                status,
                                                order.orderSource,
                                             )}
                                          </option>
                                       ))}

                                    </select> */}
                                    {/* Display-only status badge - NO dropdown */}
                                    <span
                                       className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${getStatusColor(order.orderStatus)}`}
                                    >
                                       {getDisplayStatus(
                                          order.orderStatus,
                                          order.orderSource,
                                       )}
                                    </span>
                                    <div
                                       className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getPaymentStatusColor(
                                          order.paymentStatus,
                                       )}`}
                                    >
                                       {order.paymentStatus?.toUpperCase()}
                                    </div>
                                 </div>
                              </td>
                              {/* <td className="px-6 py-4 whitespace-nowrap text-md
                               font-medium">
                                 <button
                                    onClick={() => handleViewDetails(order._id)}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                 >
                                    View Details
                                 </button>
                              </td> */}

                              <td
                                 className="px-6 py-4 align-top text-md
                               font-medium"
                              >
                                 <div className="flex flex-col gap-2">
                                    <button
                                       onClick={() =>
                                          handleViewDetails(order._id)
                                       }
                                       className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                    >
                                       <Eye size={14} /> View Details
                                    </button>

                                    {/* IN-HOUSE SPECIFIC ACTIONS */}

                                    {/* IN-HOUSE SPECIFIC ACTIONS */}
                                    {order.orderSource === "in-house" &&
                                       (() => {
                                          const actions =
                                             getOrderActions(order);

                                          return (
                                             <div className="flex flex-col gap-1 border-t pt-2 mt-1">
                                                {/* Step indicator */}
                                                {actions.message && (
                                                   <div className="text-[10px] text-gray-600 italic mb-1">
                                                      {actions.message}
                                                   </div>
                                                )}

                                                {/* Step 1: Generate Bill */}
                                                {actions.canGenerateBill && (
                                                   <button
                                                      disabled={isGenerating}
                                                      onClick={() =>
                                                         generateBill(order._id)
                                                      }
                                                      className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 justify-center ${
                                                         order.billGenerated
                                                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                            : "bg-orange-500 hover:bg-orange-600 text-white"
                                                      }`}
                                                   >
                                                      <Receipt size={12} />
                                                      {order.billGenerated
                                                         ? "REGENERATE BILL"
                                                         : "GENERATE BILL"}
                                                   </button>
                                                )}

                                                {/* Step 2: Print Bill */}
                                                {actions.canPrint && (
                                                   <button
                                                      onClick={async () => {
                                                         try {
                                                            const token =
                                                               localStorage.getItem(
                                                                  "adminToken",
                                                               );

                                                            // ✅ Use the inhouse route for in-house orders
                                                            const endpoint =
                                                               order.orderSource ===
                                                               "in-house"
                                                                  ? `${BASE_URL}/admin/inhouse/orders/${order._id}`
                                                                  : `${BASE_URL}/admin/orders/${order._id}`;

                                                            const response =
                                                               await axios.get(
                                                                  endpoint,
                                                                  {
                                                                     headers: {
                                                                        Authorization: `Bearer ${token}`,
                                                                     },
                                                                  },
                                                               );

                                                            setSelectedOrder(
                                                               response.data
                                                                  .data ||
                                                                  response.data,
                                                            );
                                                            setTimeout(
                                                               () =>
                                                                  handlePrint(),
                                                               150,
                                                            );
                                                         } catch (err) {
                                                            toast.error(
                                                               "Failed to load order for printing",
                                                            );
                                                         }
                                                      }}
                                                      className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1 justify-center hover:bg-indigo-700"
                                                   >
                                                      <Printer size={12} />{" "}
                                                      PRINT BILL
                                                   </button>
                                                )}

                                                {/* Step 3: Payment Buttons - Only if bill is printed */}
                                                {actions.canPay && (
                                                   <>
                                                      <div className="text-[9px] font-bold text-center text-gray-700 mt-1">
                                                         💰 ACCEPT PAYMENT:
                                                      </div>
                                                      <div className="grid grid-cols-2 gap-1">
                                                         <button
                                                            onClick={() =>
                                                               handleCompletePayment(
                                                                  order._id,
                                                                  "cash",
                                                               )
                                                            }
                                                            className="bg-green-600 text-white px-1 py-1 rounded text-[10px] hover:bg-green-700 font-bold"
                                                         >
                                                            💵 CASH
                                                         </button>
                                                         <button
                                                            onClick={() =>
                                                               handleCompletePayment(
                                                                  order._id,
                                                                  "upi",
                                                               )
                                                            }
                                                            className="bg-blue-600 text-white px-1 py-1 rounded text-[10px] hover:bg-blue-700 font-bold"
                                                         >
                                                            📱 UPI
                                                         </button>
                                                      </div>
                                                   </>
                                                )}

                                                {/* Step 4: Completed */}
                                                {order.paymentStatus ===
                                                   "completed" && (
                                                   <span className="text-[10px] text-green-600 font-bold text-center block mt-1 bg-green-50 py-1 rounded">
                                                      ✅ PAID & CLOSED
                                                   </span>
                                                )}
                                             </div>
                                          );
                                       })()}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {filteredOrders.length === 0 && !loading && (
                  <div className="text-center py-8">
                     <div className="text-gray-500 text-xl mb-2">
                        No orders found
                     </div>
                     <p className="text-gray-400">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        paymentFilter !== "all" ||
                        dateFilter !== "all"
                           ? "Try adjusting your filters"
                           : "No orders have been placed yet"}
                     </p>
                  </div>
               )}
            </div>
         )}

         {/* Order Details Modal */}
         {showModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold">
                        Order Details - #{selectedOrder.orderNumber}
                     </h2>
                     <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-3 right-3 md:right-1/4 bg-white rounded-full  border border-red-600 shadow-md p-2 hover:bg-red-100 transition"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Customer Info */}
                     <div>
                        <h3 className="font-semibold mb-2">
                           Customer Information
                        </h3>
                        <div
                           className="space-y-1 text-md
                        "
                        >
                           <p>
                              <strong>Name:</strong>{" "}
                              {selectedOrder.userId?.name}
                           </p>
                           <p>
                              <strong>Email:</strong>{" "}
                              {selectedOrder.userId?.email}
                           </p>
                           <p>
                              <strong>Phone:</strong>{" "}
                              {selectedOrder.userId?.phone || "N/A"}
                           </p>
                        </div>
                     </div>

                     {/* Order Info */}
                     <div>
                        <h3 className="font-semibold mb-2">
                           Order Information
                        </h3>
                        <div
                           className="space-y-1 text-md
                        "
                        >
                           <p>
                              <strong>Order Date:</strong>{" "}
                              {new Date(selectedOrder.createdAt).toLocaleString(
                                 "en-IN",
                              )}
                           </p>
                           <p>
                              <strong>Payment Method:</strong>{" "}
                              {selectedOrder.paymentMethod?.replace("_", " ")}
                           </p>
                           <p>
                              <strong>Payment Status:</strong>{" "}
                              {selectedOrder.paymentStatus}
                           </p>
                        </div>
                     </div>

                     {/* Delivery Address */}
                     <div>
                        <h3 className="font-semibold mb-2">Delivery Address</h3>
                        <div
                           className="text-md
                        "
                        >
                           <p>{selectedOrder.deliveryAddress?.addressLine1}</p>
                           {selectedOrder.deliveryAddress?.addressLine2 && (
                              <p>
                                 {selectedOrder.deliveryAddress.addressLine2}
                              </p>
                           )}
                           <p>
                              {selectedOrder.deliveryAddress?.city},{" "}
                              {selectedOrder.deliveryAddress?.state}
                           </p>
                           <p>{selectedOrder.deliveryAddress?.pincode}</p>
                        </div>
                     </div>

                     {/* Order Items */}
                     <div className="md:col-span-2">
                        <h3 className="font-semibold mb-2">Order Items</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                           {selectedOrder.items?.map((item, index) => (
                              <div
                                 key={item._id || index}
                                 className="flex justify-between items-center border-b pb-3"
                              >
                                 <div className="flex-1">
                                    <p
                                       className="font-medium text-md
                                    "
                                    >
                                       {item.name ||
                                          item.menuItem?.name ||
                                          "Unknown Item"}
                                    </p>
                                    {item.selectedAddons &&
                                       item.selectedAddons.length > 0 && (
                                          <div className="text-xs text-indigo-600 mt-0.5 space-y-0.5">
                                             {item.selectedAddons.map(
                                                (a, i) => (
                                                   <span
                                                      key={i}
                                                      className="inline-block mr-2"
                                                   >
                                                      + {a.name} (₹{a.price})
                                                   </span>
                                                ),
                                             )}
                                          </div>
                                       )}
                                    <p className="text-gray-500 text-sm">
                                       Qty: {item.quantity} × ₹{item.price}
                                       {item.selectedAddons?.length > 0 &&
                                          ` + ₹${item.selectedAddons.reduce((s, a) => s + a.price, 0)} addons`}{" "}
                                       = ₹
                                       {(item.price +
                                          (item.selectedAddons?.reduce(
                                             (s, a) => s + a.price,
                                             0,
                                          ) || 0)) *
                                          item.quantity}
                                    </p>
                                    {item.specialInstructions && (
                                       <p className="text-orange-600 text-sm italic mt-1">
                                          Note: {item.specialInstructions}
                                       </p>
                                    )}
                                 </div>

                                 {/* ✅ NEW: Item Status Badge & Controls */}
                                 {selectedOrder.orderSource === "in-house" && (
                                    <div className="flex flex-col items-end gap-2 ml-4">
                                       {/* Status Badge */}
                                       <span
                                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                                             item.status === "served"
                                                ? "bg-green-100 text-green-800"
                                                : item.status === "ready"
                                                  ? "bg-purple-100 text-purple-800"
                                                  : item.status === "preparing"
                                                    ? "bg-orange-100 text-orange-800"
                                                    : "bg-gray-100 text-gray-800"
                                          }`}
                                       >
                                          {item.status?.toUpperCase()}
                                       </span>

                                       {/* Status Control Buttons */}
                                       {selectedOrder.paymentStatus !==
                                          "completed" && (
                                          <div className="flex gap-1">
                                             {item.status === "pending" && (
                                                <button
                                                   onClick={() =>
                                                      handleItemStatusChange(
                                                         selectedOrder._id,
                                                         item._id,
                                                         "preparing",
                                                      )
                                                   }
                                                   className="bg-orange-500 text-white px-2 py-1 rounded text-[9px] hover:bg-orange-600"
                                                >
                                                   START
                                                </button>
                                             )}
                                             {item.status === "preparing" && (
                                                <button
                                                   onClick={() =>
                                                      handleItemStatusChange(
                                                         selectedOrder._id,
                                                         item._id,
                                                         "ready",
                                                      )
                                                   }
                                                   className="bg-purple-500 text-white px-2 py-1 rounded text-[9px] hover:bg-purple-600"
                                                >
                                                   READY
                                                </button>
                                             )}
                                             {item.status === "ready" && (
                                                <button
                                                   onClick={() =>
                                                      handleItemStatusChange(
                                                         selectedOrder._id,
                                                         item._id,
                                                         "served",
                                                      )
                                                   }
                                                   className="bg-green-500 text-white px-2 py-1 rounded text-[9px] hover:bg-green-600"
                                                >
                                                   SERVED
                                                </button>
                                             )}
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>

                        {/* ✅ NEW: Bulk Actions for In-House */}
                        {selectedOrder.orderSource === "in-house" &&
                           selectedOrder.paymentStatus !== "completed" &&
                           selectedOrder.items?.some(
                              (i) => i.status !== "served",
                           ) && (
                              <div className="mt-3 pt-3 border-t flex gap-2">
                                 <button
                                    onClick={() =>
                                       handleMarkAllItemsReady(
                                          selectedOrder._id,
                                       )
                                    }
                                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                                 >
                                    Mark All Ready
                                 </button>
                                 <button
                                    onClick={() =>
                                       handleMarkAllItemsServed(
                                          selectedOrder._id,
                                       )
                                    }
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                 >
                                    Mark All Served
                                 </button>
                              </div>
                           )}
                     </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t">
                     <div className="flex justify-between items-center">
                        <div>
                           <p
                              className="text-md
                            text-gray-600"
                           >
                              Subtotal: ₹{selectedOrder.totalAmount}
                           </p>
                           <p
                              className="text-md
                            text-gray-600"
                           >
                              Delivery: ₹{selectedOrder.deliveryCharges}
                           </p>
                           <p
                              className="text-md
                            text-gray-600"
                           >
                              Taxes: ₹{selectedOrder.taxes}
                           </p>
                           {selectedOrder.discountAmount > 0 && (
                              <p
                                 className="text-md
                               text-green-600"
                              >
                                 Discount: -₹{selectedOrder.discountAmount}
                              </p>
                           )}
                        </div>
                        <div className="text-right">
                           <p className="text-xl font-bold">
                              Total: ₹{selectedOrder.finalAmount}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Status History */}
                  {selectedOrder.statusHistory &&
                     selectedOrder.statusHistory.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                           <h3 className="font-semibold mb-2">
                              Status History
                           </h3>
                           <div className="space-y-2 max-h-32 overflow-y-auto">
                              {selectedOrder.statusHistory
                                 .sort(
                                    (a, b) =>
                                       new Date(b.timestamp) -
                                       new Date(a.timestamp),
                                 )
                                 .map((status, index) => (
                                    <div
                                       key={index}
                                       className="flex justify-between text-md
                                       "
                                    >
                                       <span className="capitalize">
                                          {status.status?.replace("-", " ")}
                                       </span>
                                       <span className="text-gray-500">
                                          {new Date(
                                             status.timestamp,
                                          ).toLocaleString("en-IN")}
                                       </span>
                                    </div>
                                 ))}
                           </div>
                        </div>
                     )}

                  <OrderTimeline order={selectedOrder} />
               </div>
            </div>
         )}
         <div className="hidden shadow-none pointer-events-none">
            <div className="block">
               <PrintableBill ref={componentRef} order={selectedOrder} />
            </div>
         </div>
      </div>
   );
}
