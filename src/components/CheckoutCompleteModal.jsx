import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddressModal from "../app/checkoutpage/AddressModal";
import { clearCart } from "../store/slices/cartSlice";
import { apiClient } from "../services/apiClient";
import { auth } from "../services/firebase";

const CheckoutCompleteModal = ({ onClose }) => {
   const { user } = useSelector((state) => state.auth);
   const { userDetails } = useSelector((state) => state.firebase);
   const cart = useSelector((state) => state.cart);
   const dispatch = useDispatch();
   const router = useRouter();

   const [selectedAddress, setSelectedAddress] = useState(
      userDetails?.addresses?.[0] || null
   );
   const [showAddressModal, setShowAddressModal] = useState(false);
   const [deliverTo, setDeliverTo] = useState("me");
   const [otherContact, setOtherContact] = useState({ name: "", phone: "" });
   const [placing, setPlacing] = useState(false);

   const deliveryCharges = 40; // You can make this dynamic
   const taxes = Math.round(cart.totalAmount * 0.05); // 5% tax
   const finalAmount = cart.totalAmount + deliveryCharges + taxes;

   const handleAddressSelect = (address) => {
      setSelectedAddress(address);
      setShowAddressModal(false);
   };

   const validateOrder = () => {
      if (!selectedAddress) {
         alert("Please select a delivery address");
         return false;
      }

      if (deliverTo === "others") {
         if (!otherContact.name.trim() || !otherContact.phone.trim()) {
            alert("Please provide recipient's name and phone number");
            return false;
         }

         // Validate phone number (basic)
         if (!/^\d{10}$/.test(otherContact.phone.replace(/\D/g, ""))) {
            alert("Please provide a valid 10-digit phone number");
            return false;
         }
      }

      if (cart.items.length === 0) {
         alert("Your cart is empty");
         return false;
      }

      return true;
   };

   const handlePlaceOrder = async () => {
      if (!validateOrder()) return;

      try {
         setPlacing(true);

         // Prepare customer notes
         let customerNotes = "";
         if (deliverTo === "others") {
            customerNotes = `Deliver to: ${otherContact.name} (${otherContact.phone})`;
         }

         // Prepare order payload
         const payload = {
            items: cart.items.map((item) => ({
               menuItem: item._id,
               quantity: item.qty,
               price: item.price,
               specialInstructions: item.specialInstructions || "",
            })),
            deliveryAddress: selectedAddress,
            totalAmount: cart.totalAmount,
            deliveryCharges: deliveryCharges,
            taxes: taxes,
            finalAmount: finalAmount,
            paymentMethod: "cod", // You can make this dynamic later
            customerNotes: customerNotes,
         };

         console.log("Placing order with payload:", payload);

         //using apiClient utility that handles token retrieval
         //  const data = await apiClient("/api/orders", "POST", payload);

         const currentUser = auth.currentUser;
         if (!currentUser) {
            throw new Error("User not authenticated");
         }

         const token = await currentUser.getIdToken();

         const response = await axios.post(
            "http://localhost:9999/api/orders",
            payload,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
               },
            }
         );

         console.log("Full response:", response);
         console.log("Response data:", response.data);

         // Check if we got a valid response
         if (!response.data || !response.data._id) {
            throw new Error("Invalid response from server - missing order ID");
         }

         const orderData = response.data;
         console.log("Order placed successfully:", orderData._id);

         // Clear cart after successful order
         dispatch(clearCart());
         onClose();
         router.push(`/orders/${orderData._id}`);
      } catch (error) {
         console.error("Order placement failed:", error);

         let errorMessage = "Failed to place order. Please try again.";
         if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
         } else if (error.message) {
            errorMessage = error.message;
         }

         alert(errorMessage);
      } finally {
         setPlacing(false);
      }
   };

   return (
      <>
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Checkout</h2>
                  <button
                     onClick={onClose}
                     className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                     ×
                  </button>
               </div>

               {/* Order Summary */}
               <div className="border rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2">
                     {cart.items.map((item) => (
                        <div
                           key={item._id}
                           className="flex justify-between items-center"
                        >
                           <div className="flex items-center space-x-3">
                              <img
                                 src={item.image}
                                 alt={item.name}
                                 className="w-10 h-10 object-cover rounded"
                              />
                              <div>
                                 <p className="font-medium">{item.name}</p>
                                 <p className="text-sm text-gray-600">
                                    Qty: {item.qty}
                                 </p>
                              </div>
                           </div>
                           <span className="font-medium">
                              ₹{item.price * item.qty}
                           </span>
                        </div>
                     ))}
                  </div>

                  <div className="border-t mt-3 pt-3 space-y-1">
                     <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{cart.totalAmount}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span>₹{deliveryCharges}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Taxes:</span>
                        <span>₹{taxes}</span>
                     </div>
                     <div className="flex justify-between font-bold text-lg border-t pt-1">
                        <span>Total:</span>
                        <span>₹{finalAmount}</span>
                     </div>
                  </div>
               </div>

               {/* Delivery Address */}
               <div className="border rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-3">Delivery Address</h3>
                  {selectedAddress ? (
                     <div className="bg-gray-50 p-3 rounded mb-3">
                        <p className="font-medium text-green-600">
                           {selectedAddress.label}
                        </p>
                        <p>{selectedAddress.addressLine1}</p>
                        {selectedAddress.addressLine2 && (
                           <p>{selectedAddress.addressLine2}</p>
                        )}
                        <p>
                           {selectedAddress.city}, {selectedAddress.state} -{" "}
                           {selectedAddress.pincode}
                        </p>
                        {selectedAddress.landmark && (
                           <p className="text-sm text-gray-600">
                              Near: {selectedAddress.landmark}
                           </p>
                        )}
                     </div>
                  ) : (
                     <p className="text-gray-500 mb-3">No address selected</p>
                  )}

                  <button
                     onClick={() => setShowAddressModal(true)}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                     {selectedAddress ? "Change Address" : "Select Address"}
                  </button>
               </div>

               {/* Delivery Options */}
               <div className="border rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-3">Delivery Options</h3>
                  <div className="space-y-3">
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                           type="radio"
                           value="me"
                           checked={deliverTo === "me"}
                           onChange={() => setDeliverTo("me")}
                           className="text-green-600"
                        />
                        <span>Deliver to me</span>
                     </label>

                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                           type="radio"
                           value="others"
                           checked={deliverTo === "others"}
                           onChange={() => setDeliverTo("others")}
                           className="text-green-600"
                        />
                        <span>Deliver to someone else</span>
                     </label>

                     {deliverTo === "others" && (
                        <div className="ml-6 space-y-2">
                           <input
                              type="text"
                              placeholder="Recipient Name"
                              value={otherContact.name}
                              onChange={(e) =>
                                 setOtherContact({
                                    ...otherContact,
                                    name: e.target.value,
                                 })
                              }
                              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                           />
                           <input
                              type="tel"
                              placeholder="Recipient Phone (10 digits)"
                              value={otherContact.phone}
                              onChange={(e) =>
                                 setOtherContact({
                                    ...otherContact,
                                    phone: e.target.value,
                                 })
                              }
                              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                           />
                        </div>
                     )}
                  </div>
               </div>

               {/* Payment Method */}
               <div className="border rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                     <span className="font-medium">Cash on Delivery</span>
                     <p className="text-sm text-gray-600">
                        Pay when your order arrives
                     </p>
                  </div>
               </div>

               {/* Place Order Button */}
               <button
                  onClick={handlePlaceOrder}
                  disabled={placing || !selectedAddress}
                  className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
               >
                  {placing
                     ? "Placing Order..."
                     : `Place Order - ₹${finalAmount}`}
               </button>
            </div>
         </div>

         {/* Address Modal */}
         {showAddressModal && (
            <AddressModal
               addresses={userDetails?.addresses || []}
               onClose={() => setShowAddressModal(false)}
               onSelect={handleAddressSelect}
            />
         )}
      </>
   );
};

export default CheckoutCompleteModal;
