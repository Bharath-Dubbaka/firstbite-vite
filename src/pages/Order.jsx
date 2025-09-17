
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const OrdersPage = () => {
   const router = useNavigate();
   const { user } = useSelector((state) => state.auth);
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [authLoading, setAuthLoading] = useState(true);

   // Listen to Firebase auth state changes
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
         setAuthLoading(false);
         if (!firebaseUser && !user) {
            router("/");
         }
      });

      return () => unsubscribe();
   }, [user, router]);

   useEffect(() => {
      if (authLoading) return;

      const currentUser = auth.currentUser;
      if (!currentUser && !user) {
         router("/");
         return;
      }

      fetchOrders();
   }, [user, authLoading]);

   const fetchOrders = async () => {
      try {
         setLoading(true);
         setError(null);

         const currentUser = auth.currentUser;
         if (!currentUser) {
            throw new Error("User not authenticated");
         }

         const token = await currentUser.getIdToken();

         const response = await axios.get("http://localhost:9999/api/orders", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         setOrders(response.data);
      } catch (err) {
         console.error("Failed to fetch orders:", err);
         setError(
            err.response?.data?.error || err.message || "Failed to load orders"
         );
      } finally {
         setLoading(false);
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

   const handleOrderClick = (orderId) => {
      router(`/orders/${orderId}`);
   };

   // Show loading while checking auth
   if (authLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading...</p>
            </div>
         </div>
      );
   }

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="text-red-500 text-6xl mb-4">⚠️</div>
               <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Error Loading Orders
               </h2>
               <p className="text-gray-600 mb-4">{error}</p>
               <div className="space-x-4">
                  <button
                     onClick={fetchOrders}
                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                     Try Again
                  </button>
                  <button
                     onClick={() => router("/")}
                     className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                     Go Home
                  </button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900">
                        My Orders
                     </h1>
                     <p className="text-gray-600 mt-1">
                        View and track all your orders
                     </p>
                  </div>
                  <button
                     onClick={() => router("/")}
                     className="mt-4 sm:mt-0 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                     Continue Shopping
                  </button>
               </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
               <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                     No Orders Yet
                  </h2>
                  <p className="text-gray-600 mb-6">
                     You haven't placed any orders yet. Start exploring our
                     menu!
                  </p>
                  <button
                     onClick={() => router("/")}
                     className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                     Start Shopping
                  </button>
               </div>
            ) : (
               <div className="space-y-6">
                  {orders.map((order) => (
                     <div
                        key={order._id}
                        onClick={() => handleOrderClick(order._id)}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border hover:border-green-300"
                     >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                           {/* Order Info */}
                           <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                 <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                       Order #{order.orderNumber}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                       {new Date(
                                          order.createdAt
                                       ).toLocaleDateString("en-IN", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                       })}
                                    </p>
                                 </div>
                                 <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
                                    <span
                                       className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                          order.orderStatus
                                       )}`}
                                    >
                                       order:{" "}
                                       {order.orderStatus
                                          .charAt(0)
                                          .toUpperCase() +
                                          order.orderStatus.slice(1)}
                                    </span>
                                    <span
                                       className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                                          order.paymentStatus
                                       )}`}
                                    >
                                       payment:{" "}
                                       {order.paymentStatus
                                          .charAt(0)
                                          .toUpperCase() +
                                          order.paymentStatus.slice(1)}
                                    </span>
                                 </div>
                              </div>

                              {/* Order Items Preview */}
                              <div className="flex items-center space-x-4 mb-4">
                                 <div className="flex -space-x-2">
                                    {order.items
                                       .slice(0, 3)
                                       .map((item, index) => (
                                          <div
                                             key={index}
                                             className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center overflow-hidden"
                                          >
                                             {item.menuItem?.image ? (
                                                <img
                                                   src={item.menuItem.image}
                                                   alt={
                                                      item.menuItem.name ||
                                                      "Item"
                                                   }
                                                   className="w-full h-full object-cover"
                                                />
                                             ) : (
                                                <span className="text-xs">
                                                   🍽️
                                                </span>
                                             )}
                                          </div>
                                       ))}
                                    {order.items.length > 3 && (
                                       <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                                          <span className="text-xs text-gray-600">
                                             +{order.items.length - 3}
                                          </span>
                                       </div>
                                    )}
                                 </div>
                                 <div className="text-sm text-gray-600">
                                    <span className="font-medium">
                                       {order.items.length}
                                    </span>{" "}
                                    {order.items.length === 1
                                       ? "item"
                                       : "items"}
                                 </div>
                              </div>

                              {/* Order Items Names */}
                              <div className="text-sm text-gray-600 mb-4">
                                 {order.items.slice(0, 2).map((item, index) => (
                                    <span key={index}>
                                       {item.menuItem?.name || "Menu Item"} x
                                       {item.quantity}
                                       {index <
                                          Math.min(order.items.length, 2) - 1 &&
                                          ", "}
                                    </span>
                                 ))}
                                 {order.items.length > 2 && (
                                    <span className="text-gray-500">
                                       {" "}
                                       and {order.items.length - 2} more item
                                       {order.items.length - 2 !== 1 ? "s" : ""}
                                    </span>
                                 )}
                              </div>
                           </div>

                           {/* Order Total & Action */}
                           <div className="flex flex-row sm:flex-col items-center justify-between sm:items-end sm:text-right lg:ml-6 mt-4 lg:mt-0">
                              <div>
                                 <p className="text-2xl font-bold text-gray-900">
                                    ₹{order.finalAmount}
                                 </p>
                                 <p className="text-sm text-gray-600">
                                    via {order.paymentMethod.replace("_", " ")}
                                 </p>
                              </div>
                              <div className="flex items-center text-green-600 text-sm font-medium mt-2">
                                 View Details
                                 <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M9 5l7 7-7 7"
                                    />
                                 </svg>
                              </div>
                           </div>
                        </div>

                        {/* Delivery Address (Preview) */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                           <div className="flex items-center text-sm text-gray-600">
                              <svg
                                 className="w-4 h-4 mr-2"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                 />
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                 />
                              </svg>
                              <span>
                                 {order.deliveryAddress.label || "Delivery to"}:{" "}
                                 {order.deliveryAddress.city},{" "}
                                 {order.deliveryAddress.pincode}
                              </span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

export default OrdersPage;
