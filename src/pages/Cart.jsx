import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
   increaseQty,
   decreaseQty,
   removeItem,
} from "../../store/slices/cartSlice";
import CheckoutButton from "../../components/CheckoutButton";
import { auth } from "../../services/firebase";
import axios from "axios";

const CartPage = () => {
   const dispatch = useDispatch();
   const router = useNavigate();
   const { items, totalAmount, totalQuantity } = useSelector(
      (state) => state.cart
   );

   const [activeOrder, setActiveOrder] = useState(null);
   const [hasActiveOrder, setHasActiveOrder] = useState(false);

   // Check for active orders on component mount
   useEffect(() => {
      checkForActiveOrders();
   }, []);

   const handleGoBack = () => {
      router.back(); // Go back to previous page
      // Alternative: router.push('/') to go to home page specifically
   };

   // check for active orders before allowing checkout
   const checkForActiveOrders = async () => {
      try {
         const currentUser = auth.currentUser;
         if (!currentUser) return false;

         const token = await currentUser.getIdToken();
         const response = await axios.get("http://localhost:9999/api/orders", {
            headers: { Authorization: `Bearer ${token}` },
         });

         const activeStatuses = [
            "placed",
            "confirmed",
            "preparing",
            "ready",
            "dispatched",
         ];
         const activeOrder = response.data.find((order) =>
            activeStatuses.includes(order.orderStatus)
         );

         return activeOrder;
      } catch (error) {
         console.error("Error checking active orders:", error);
         return false;
      }
   };

   const handleCheckout = async () => {
      const activeOrder = await checkForActiveOrders();

      if (activeOrder) {
         // Show modal or alert
         setShowActiveOrderModal(true);
         setActiveOrder(activeOrder);
         return;
      }

      // Proceed with normal checkout
      proceedToCheckout();
   };

   const renderCheckoutButton = () => {
      if (hasActiveOrder) {
         return (
            <div>
               <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
               >
                  Checkout Disabled - Active Order in Progress
               </button>
               <p className="text-sm text-gray-600 text-center mt-2">
                  Complete or cancel your current order #
                  {activeOrder?.orderNumber} to place a new one
               </p>
            </div>
         );
      }

      return <CheckoutButton />;
   };

   return (
      <div className="max-w-4xl mx-auto p-4 pt-28">
         {/* Back Button */}
         <button
            onClick={handleGoBack}
            className="flex items-center gap-2 mb-6 text-green-600 hover:text-green-800 transition-colors"
         >
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
         </button>

         <h1 className="text-2xl font-bold mb-4">
            Your Cart ({totalQuantity} items)
         </h1>

         {items.length === 0 ? (
            <div className="text-center py-12">
               <p className="text-gray-500 mb-4">Your cart is empty.</p>
               <button
                  onClick={handleGoBack}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
               >
                  Browse Menu
               </button>
            </div>
         ) : (
            <div className="space-y-4">
               {items.map((item) => (
                  <div
                     key={item._id}
                     className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
                  >
                     {/* Item Info */}
                     <div className="flex items-start gap-3">
                        <img
                           src={item.image}
                           alt={item.name}
                           className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                           <h2 className="font-semibold">{item.name}</h2>
                           <p className="text-sm text-gray-600">
                              {item.description}
                           </p>
                           <p className="mt-1 font-medium">₹{item.price}</p>
                        </div>
                     </div>

                     {/* Quantity Controls */}
                     <div className="flex items-center gap-3">
                        <button
                           className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
                           onClick={() => dispatch(decreaseQty(item._id))}
                        >
                           -
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                           className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
                           onClick={() => dispatch(increaseQty(item._id))}
                        >
                           +
                        </button>
                     </div>

                     {/* Remove */}
                     <button
                        className="text-red-500 hover:text-red-700 hover:underline ml-4 transition-colors"
                        onClick={() => dispatch(removeItem(item._id))}
                     >
                        Remove
                     </button>
                  </div>
               ))}

               {/* Total Section */}
               <div className="border-t pt-4 bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                     <h2 className="text-xl font-bold">
                        Total: ₹{totalAmount}
                     </h2>
                     {renderCheckoutButton()}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default CartPage;
