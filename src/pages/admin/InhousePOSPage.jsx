// src/pages/admin/InhousePOSPage.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";
import { ShoppingCart, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

export default function InhousePOSPage() {
   const location = useLocation();
   const [menu, setMenu] = useState([]);
   const [cart, setCart] = useState([]);
   const [tableNumber, setTableNumber] = useState(
      location.state?.tableNumber || "",
   );
   const [customerName, setCustomerName] = useState("");
   const [guestCount, setGuestCount] = useState(1);
   const [activeOrderForTable, setActiveOrderForTable] = useState(null);

   useEffect(() => {
      const fetchMenu = async () => {
         const res = await axios.get(`${BASE_URL}/menu`);
         setMenu(res.data.data);
      };
      fetchMenu();
   }, []);

   const addToCart = (item) => {
      setCart((prev) => {
         const existing = prev.find((i) => i._id === item._id);
         if (existing)
            return prev.map((i) =>
               i._id === item._id ? { ...i, qty: i.qty + 1 } : i,
            );
         return [...prev, { ...item, qty: 1 }];
      });
   };

   const removeFromCart = (id) => {
      setCart((prev) => prev.filter((i) => i._id !== id));
   };

   const calculateTotal = () =>
      cart.reduce((acc, item) => acc + item.price * item.qty, 0);

   const checkTableStatus = async (num) => {
      if (!num) return;
      try {
         const token = localStorage.getItem("adminToken");
         const res = await axios.get(`${BASE_URL}/admin/inhouse/tables`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         const table = res.data.data.find((t) => t.tableNumber == num); // Use == for number/string comparison

         if (table && table.status === "occupied" && table.currentOrderId) {
            setActiveOrderForTable(table.currentOrderId);
         } else {
            setActiveOrderForTable(null);
         }
      } catch (err) {
         console.error("Status check failed", err);
      }
   };

   const submitOrder = async () => {
      // ✅ Validation FIRST
      if (!tableNumber) return toast.error("Please select a table");
      if (cart.length === 0) return toast.error("Cart is empty");

      // ✅ Define orderPayload BEFORE using it
      const orderPayload = {
         tableNumber: Number(tableNumber), // Ensure it's a number
         customerName,
         guestCount: Number(guestCount),
         items: cart.map((i) => ({ menuItem: i._id, quantity: i.qty })),
      };

      console.log("🔍 Submitting order:", {
         tableNumber,
         activeOrderForTable,
         orderPayload,
      });

      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
         if (activeOrderForTable) {
            // ✅ Check if order is in billing status
            const orderCheck = await axios.get(
               `${BASE_URL}/admin/orders/${activeOrderForTable._id || activeOrderForTable}`,
               config,
            );

            const isBilling = orderCheck.data?.orderStatus === "billing";

            const message = isBilling
               ? `⚠️ Table ${tableNumber} has a printed bill. Adding items will require bill regeneration. Continue?`
               : `Table ${tableNumber} is occupied. Add items to current bill?`;

            const confirmed = window.confirm(message);

            if (confirmed) {
               const orderId = activeOrderForTable._id || activeOrderForTable;

               const response = await axios.put(
                  `${BASE_URL}/admin/inhouse/orders/${orderId}/add-items`,
                  { items: orderPayload.items },
                  config,
               );

               // ✅ Show warning if bill needs regeneration
               if (response.data.needsBillRegeneration) {
                  toast.warning(
                     "Items added! Please regenerate bill before payment.",
                     { duration: 5000 },
                  );
               } else {
                  toast.success("Items added to existing order!");
               }

               setCart([]);
               setActiveOrderForTable(null);
            }
            return;
         }

         // Create new order
         await axios.post(
            `${BASE_URL}/admin/inhouse/orders`,
            orderPayload,
            config,
         );

         toast.success("New Order Placed!");
         setCart([]);
         setTableNumber("");
         setCustomerName("");
         setGuestCount(1);
      } catch (err) {
         console.error("Order submission error:", err.response?.data || err);

         if (
            err.response?.status === 400 &&
            err.response?.data?.existingOrder
         ) {
            const existingId = err.response.data.existingOrder._id;

            try {
               const response = await axios.put(
                  `${BASE_URL}/admin/inhouse/orders/${existingId}/add-items`,
                  { items: orderPayload.items },
                  config,
               );

               if (response.data.needsBillRegeneration) {
                  toast.warning("Items added! Bill needs regeneration.", {
                     duration: 5000,
                  });
               } else {
                  toast.success("Items added to existing order!");
               }

               setCart([]);
               setTableNumber("");
               setCustomerName("");
               setGuestCount(1);
            } catch (addErr) {
               toast.error("Failed to add items");
               console.error("Add items error:", addErr);
            }
         } else {
            toast.error(err.response?.data?.error || "Failed to place order");
         }
      }
   };

   return (
      <div className="flex h-[calc(100vh-100px)] gap-4">
         {/* Left: Menu Selection */}
         <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50 flex justify-between">
               <input
                  type="text"
                  placeholder="Search menu..."
                  className="border rounded-lg px-4 py-2 w-64"
               />
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
               {menu.map((item) => (
                  <div
                     key={item._id}
                     onClick={() => addToCart(item)}
                     className="border rounded-xl p-3 hover:border-indigo-500 cursor-pointer transition-all active:scale-95"
                  >
                     <h3 className="font-bold text-md leading-tight h-8">
                        {item.name}
                     </h3>
                     <p className="text-indigo-600 font-bold mt-1">
                        ₹{item.price}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Cart & Billing */}
         <div className="w-96 bg-white rounded-xl shadow-lg border flex flex-col">
            <div className="p-4 border-b bg-indigo-600 text-white rounded-t-xl">
               <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart /> New Order
               </h2>
            </div>

            <div className="p-4 space-y-4 border-b">
               <div className="flex gap-2">
                  <div className="flex-1">
                     <label className="text-[10px] uppercase font-bold text-gray-500">
                        Table
                     </label>
                     <input
                        type="number"
                        value={tableNumber}
                        onChange={(e) => {
                           const val = e.target.value;
                           setTableNumber(val);
                           checkTableStatus(val);
                        }}
                        className="w-full border-b focus:border-indigo-600 outline-none p-1"
                        placeholder="Ex: 12"
                     />
                  </div>
                  <div className="w-20">
                     <label className="text-[10px] uppercase font-bold text-gray-500">
                        Guests
                     </label>
                     <input
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full border-b focus:border-indigo-600 outline-none p-1"
                     />
                  </div>
               </div>
               <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border-b focus:border-indigo-600 outline-none p-1"
                  placeholder="Customer Name (Optional)"
               />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {cart.map((item) => (
                  <div
                     key={item._id}
                     className="flex justify-between items-center text-md"
                  >
                     <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-500 text-sm">
                           ₹{item.price} x {item.qty}
                        </p>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="font-bold">
                           ₹{item.price * item.qty}
                        </span>
                        <button
                           onClick={() => removeFromCart(item._id)}
                           className="text-red-400 hover:text-red-600"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
               ))}
               {cart.length === 0 && (
                  <p className="text-center text-gray-400 mt-10">Empty Cart</p>
               )}
            </div>

            <div className="p-4 bg-gray-50 border-t space-y-2">
               <div className="flex justify-between text-gray-600 text-md">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal()}</span>
               </div>
               <div className="flex justify-between text-gray-600 text-md">
                  <span>Taxes (5%)</span>
                  <span>₹{Math.round(calculateTotal() * 0.05)}</span>
               </div>
               <div className="flex justify-between text-xl font-black text-indigo-700 pt-2 border-t">
                  <span>Total</span>
                  <span>
                     ₹{calculateTotal() + Math.round(calculateTotal() * 0.05)}
                  </span>
               </div>
               <button
                  onClick={submitOrder}
                  className={`w-full py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 transition-colors ${
                     activeOrderForTable
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
               >
                  <CheckCircle size={20} />
                  {activeOrderForTable
                     ? "ADD TO RUNNING BILL"
                     : "PUNCH NEW ORDER"}
               </button>
            </div>
         </div>
      </div>
   );
}
