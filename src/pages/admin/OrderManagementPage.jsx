//src/pages/admin/OrderManagementPage.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";

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

   const API_BASE_URL = BASE_URL + "/admin/orders";

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
                  .includes(searchTerm.toLowerCase())
         );
      }

      // Status filter
      if (statusFilter !== "all") {
         filtered = filtered.filter(
            (order) => order.orderStatus === statusFilter
         );
      }

      // Payment filter
      if (paymentFilter !== "all") {
         filtered = filtered.filter(
            (order) => order.paymentStatus === paymentFilter
         );
      }

      // Date filter
      if (dateFilter !== "all") {
         const now = new Date();
         const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
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
            { headers: { Authorization: `Bearer ${token}` } }
         );
         fetchOrders(); // Refresh data
      } catch (err) {
         setError("Failed to update order status.");
         console.error("Status update error:", err);
      }
   };

   const handleViewDetails = async (orderId) => {
      try {
         console.log("Fetching order details for ID:", orderId); // Debug log
         const token = localStorage.getItem("adminToken");
         console.log("Using admin token:", token ? "Token exists" : "No token"); // Debug log

         const response = await axios.get(`${API_BASE_URL}/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
         });

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
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
               Order Management
            </h1>
            <div className="flex items-center space-x-4">
               <span className="text-sm text-gray-600">
                  Total Orders: {filteredOrders.length}
               </span>
               <button
                  onClick={fetchOrders}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
               >
                  🔄 Refresh
               </button>
            </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

               {/* Payment Filter */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="text-gray-600 hover:text-gray-800 text-sm underline"
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
               <div className="overflow-x-auto">
                  <table className="min-w-full">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order Details
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items & Amount
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                           <tr key={order._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div>
                                    <div className="text-sm font-medium text-gray-900">
                                       #{order.orderNumber}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                       {new Date(
                                          order.createdAt
                                       ).toLocaleDateString("en-IN", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                       })}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                       {order.paymentMethod
                                          ?.replace("_", " ")
                                          .toUpperCase()}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div>
                                    <div className="text-sm font-medium text-gray-900">
                                       {order.userId?.name || "N/A"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                       {order.userId?.email || "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                       {order.deliveryAddress?.city},{" "}
                                       {order.deliveryAddress?.pincode}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div>
                                    <div className="text-sm font-medium text-gray-900">
                                       ₹{order.finalAmount}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                       {order.items?.length || 0} item
                                       {order.items?.length !== 1 ? "s" : ""}
                                    </div>
                                    {order.deliveryCharges > 0 && (
                                       <div className="text-xs text-gray-400">
                                          +₹{order.deliveryCharges} delivery
                                       </div>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="space-y-2">
                                    <select
                                       value={order.orderStatus}
                                       onChange={(e) =>
                                          handleStatusChange(
                                             order._id,
                                             e.target.value
                                          )
                                       }
                                       className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(
                                          order.orderStatus
                                       )}`}
                                    >
                                       {statusOptions.map((status) => (
                                          <option key={status} value={status}>
                                             {status
                                                .replace("-", " ")
                                                .toUpperCase()}
                                          </option>
                                       ))}
                                    </select>
                                    <div
                                       className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                                          order.paymentStatus
                                       )}`}
                                    >
                                       {order.paymentStatus?.toUpperCase()}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                 <button
                                    onClick={() => handleViewDetails(order._id)}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                 >
                                    View Details
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {filteredOrders.length === 0 && !loading && (
                  <div className="text-center py-8">
                     <div className="text-gray-500 text-lg mb-2">
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
                     <h2 className="text-xl font-bold">
                        Order Details - #{selectedOrder.orderNumber}
                     </h2>
                     <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                     >
                        ×
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Customer Info */}
                     <div>
                        <h3 className="font-semibold mb-2">
                           Customer Information
                        </h3>
                        <div className="space-y-1 text-sm">
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
                        <div className="space-y-1 text-sm">
                           <p>
                              <strong>Order Date:</strong>{" "}
                              {new Date(selectedOrder.createdAt).toLocaleString(
                                 "en-IN"
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
                        <div className="text-sm">
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
                     <div>
                        <h3 className="font-semibold mb-2">Order Items</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                           {selectedOrder.items?.map((item, index) => (
                              <div
                                 key={index}
                                 className="flex justify-between text-sm border-b pb-2"
                              >
                                 <div>
                                    <p className="font-medium">
                                       {item.menuItem?.name || "Unknown Item"}
                                    </p>
                                    <p className="text-gray-500">
                                       Qty: {item.quantity}
                                    </p>
                                 </div>
                                 <div className="text-right">
                                    <p>₹{item.price} each</p>
                                    <p className="font-medium">
                                       ₹{item.price * item.quantity}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t">
                     <div className="flex justify-between items-center">
                        <div>
                           <p className="text-sm text-gray-600">
                              Subtotal: ₹{selectedOrder.totalAmount}
                           </p>
                           <p className="text-sm text-gray-600">
                              Delivery: ₹{selectedOrder.deliveryCharges}
                           </p>
                           <p className="text-sm text-gray-600">
                              Taxes: ₹{selectedOrder.taxes}
                           </p>
                           {selectedOrder.discountAmount > 0 && (
                              <p className="text-sm text-green-600">
                                 Discount: -₹{selectedOrder.discountAmount}
                              </p>
                           )}
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-bold">
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
                                       new Date(a.timestamp)
                                 )
                                 .map((status, index) => (
                                    <div
                                       key={index}
                                       className="flex justify-between text-sm"
                                    >
                                       <span className="capitalize">
                                          {status.status?.replace("-", " ")}
                                       </span>
                                       <span className="text-gray-500">
                                          {new Date(
                                             status.timestamp
                                          ).toLocaleString("en-IN")}
                                       </span>
                                    </div>
                                 ))}
                           </div>
                        </div>
                     )}
               </div>
            </div>
         )}
      </div>
   );
}
