// src/components/admin/PrintableBill.jsx
import React from "react";

export const PrintableBill = React.forwardRef(({ order, billData }, ref) => {
   if (!order) return null;
   console.log("ORDER DATA:", order);

   return (
      <div
         ref={ref}
         className="p-8 bg-white text-black font-mono w-[80mm] mx-auto text-sm"
      >
         <div className="text-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold uppercase">Love At First Byte</h2>
            <p className="text-xs">Cafe & Restaurant</p>
            <p className="text-[10px]">
               HUDA Layout, Nallagandla, Telangana 500019
            </p>
            <p className="text-[10px]">GSTIN: 36BTSPP2167F1Z9</p>
         </div>

         <div className="mb-4 text-[10px]">
            <div className="flex justify-between">
               <span>Bill: {order.orderNumber}</span>
               <span>Table: {order.tableNumber}</span>
            </div>
            <div className="flex justify-between">
               <span>Date: {new Date().toLocaleDateString()}</span>
               <span>Time: {new Date().toLocaleTimeString()}</span>
            </div>
         </div>

         <table className="w-full mb-4 border-b border-t text-[11px]">
            <thead>
               <tr className="border-b">
                  <th className="text-left py-1">Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Price</th>
               </tr>
            </thead>
            <tbody>
               {order.items.map((item, idx) => (
                  <tr key={idx}>
                     <td className="py-1">{item.menuItem?.name || "Item"}</td>
                     <td className="text-center">{item.quantity}</td>
                     <td className="text-right">
                        ₹{item.price * item.quantity}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         <div className="space-y-1 text-right text-[11px]">
            <div className="flex justify-between">
               <span>Subtotal:</span>
               <span>₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between">
               <span>Taxes (5%):</span>
               <span>₹{order.taxes}</span>
            </div>
            {order.discountAmount > 0 && (
               <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-₹{order.discountAmount}</span>
               </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-1 border-t">
               <span>Total:</span>
               <span>₹{order.finalAmount}</span>
            </div>
         </div>

         <div className="text-center mt-6 pt-4 border-t text-[10px]">
            <p>Thank you for dining with us!</p>
            <p>Visit again soon.</p>
         </div>
      </div>
   );
});
