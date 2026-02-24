// src/components/admin/PrintableBill.jsx - LEGALLY COMPLIANT INDIAN BILL
import React from "react";

export const PrintableBill = React.forwardRef(({ order }, ref) => {
   if (!order) return null;

   // Calculate CGST & SGST separately
   const cgst = order.taxes ? order.taxes / 2 : 0;
   const sgst = order.taxes ? order.taxes / 2 : 0;

   // Generate bill serial number (you should fetch this from backend)
   const billSerial = `B${new Date().getFullYear()}-${String(order.orderNumber).split("-")[2] || "001"}`;

   return (
      <div
         ref={ref}
         className="p-6 bg-white text-black font-mono w-[80mm] mx-auto text-[10px] leading-tight"
      >
         {/* ========== HEADER ========== */}
         <div className="text-center mb-3 border-b-2 border-black pb-2">
            <h1 className="text-lg font-bold tracking-wide">
               LOVE AT FIRST BYTE
            </h1>
            <p className="text-[9px] font-semibold">Cafe & Restaurant</p>
            <p className="text-[8px] mt-1">
               HUDA Layout, Nallagandla
               <br />
               Hyderabad, Telangana - 500019
            </p>
            <p className="text-[8px] mt-1">
               Phone: +91 98765 43210 | Email: hello@loveatfirstbyte.in
            </p>
         </div>

         {/* ========== LEGAL INFO (REQUIRED) ========== */}
         <div className="text-center mb-3 pb-2 border-b border-dashed border-gray-400">
            <div className="grid grid-cols-2 gap-1 text-[8px]">
               <div className="text-left">
                  <strong>GSTIN:</strong> 36BTSPP2167F1Z9
               </div>
               <div className="text-right">
                  <strong>FSSAI:</strong> 12345678901234
               </div>
            </div>
            <div className="text-[8px] mt-1">
               <strong>SAC Code:</strong> 996331 (Restaurant Services)
            </div>
         </div>

         {/* ========== INVOICE DETAILS ========== */}
         <div className="mb-3 text-[9px]">
            <div className="grid grid-cols-2 gap-1">
               <div>
                  <strong>Invoice No:</strong> {billSerial}
               </div>
               <div className="text-right">
                  <strong>Table:</strong> {order.tableNumber || "N/A"}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
               <div>
                  <strong>Date:</strong>{" "}
                  {new Date().toLocaleDateString("en-GB")}
               </div>
               <div className="text-right">
                  <strong>Time:</strong>{" "}
                  {new Date().toLocaleTimeString("en-IN", {
                     hour: "2-digit",
                     minute: "2-digit",
                  })}
               </div>
            </div>
            {order.customerName && (
               <div className="mt-1">
                  <strong>Customer:</strong> {order.customerName}
               </div>
            )}
            <div className="mt-1">
               <strong>Order Type:</strong>{" "}
               {order.orderSource?.toUpperCase() || "DINE-IN"}
            </div>
         </div>

         {/* ========== ITEMS TABLE ========== */}
         <table className="w-full mb-3 border-t-2 border-b border-black text-[9px]">
            <thead>
               <tr className="border-b border-black">
                  <th className="text-left py-1 pr-1 w-[50%]">ITEM</th>
                  <th className="text-center px-1 w-[15%]">QTY</th>
                  <th className="text-right px-1 w-[17%]">RATE</th>
                  <th className="text-right pl-1 w-[18%]">AMT</th>
               </tr>
            </thead>
            <tbody>
               {order.items?.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                     <td className="py-1 pr-1">
                        {item.name || item.menuItem?.name || "Item"}
                     </td>
                     <td className="text-center px-1">{item.quantity}</td>
                     <td className="text-right px-1">₹{item.price}</td>
                     <td className="text-right pl-1">
                        ₹{(item.price * item.quantity).toFixed(2)}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         {/* ========== AMOUNT BREAKDOWN ========== */}
         <div className="mb-3 text-[9px] border-b border-dashed border-gray-400 pb-2">
            <div className="flex justify-between py-0.5">
               <span>Subtotal:</span>
               <span>₹{order.totalAmount?.toFixed(2)}</span>
            </div>

            {/* ✅ CGST & SGST BREAKDOWN (LEGALLY REQUIRED) */}
            <div className="flex justify-between py-0.5">
               <span>CGST @ 2.5%:</span>
               <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-0.5">
               <span>SGST @ 2.5%:</span>
               <span>₹{sgst.toFixed(2)}</span>
            </div>

            {/* Service Charge (if applicable) */}
            {order.serviceCharge > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>Service Charge:</span>
                  <span>₹{order.serviceCharge.toFixed(2)}</span>
               </div>
            )}

            {/* Delivery Charges */}
            {order.deliveryCharges > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>Delivery Charges:</span>
                  <span>₹{order.deliveryCharges.toFixed(2)}</span>
               </div>
            )}

            {/* Packaging Charges */}
            {order.packagingCharges > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>Packaging:</span>
                  <span>₹{order.packagingCharges.toFixed(2)}</span>
               </div>
            )}

            {/* Discount */}
            {order.discountAmount > 0 && (
               <div className="flex justify-between py-0.5 text-red-600">
                  <span>Discount:</span>
                  <span>-₹{order.discountAmount.toFixed(2)}</span>
               </div>
            )}

            {/* Round Off */}
            {order.roundOff && order.roundOff !== 0 && (
               <div className="flex justify-between py-0.5">
                  <span>Round Off:</span>
                  <span>
                     {order.roundOff > 0 ? "+" : ""}₹{order.roundOff.toFixed(2)}
                  </span>
               </div>
            )}
         </div>

         {/* ========== GRAND TOTAL ========== */}
         <div className="mb-3 border-t-2 border-b-2 border-black py-2">
            <div className="flex justify-between text-sm font-bold">
               <span>GRAND TOTAL:</span>
               <span>₹{order.finalAmount?.toFixed(2)}</span>
            </div>
         </div>

         {/* ========== PAYMENT INFO ========== */}
         <div className="mb-3 text-[8px] pb-2 border-b border-dashed border-gray-400">
            <div className="flex justify-between">
               <span>Payment Mode:</span>
               <span className="font-semibold uppercase">
                  {order.paymentMethod || "CASH"}
               </span>
            </div>
            <div className="flex justify-between mt-1">
               <span>Payment Status:</span>
               <span
                  className={`font-semibold ${
                     order.paymentStatus === "completed"
                        ? "text-green-600"
                        : "text-orange-600"
                  }`}
               >
                  {order.paymentStatus?.toUpperCase() || "PENDING"}
               </span>
            </div>
         </div>

         {/* ========== TAX SUMMARY (GOOD PRACTICE) ========== */}
         <div className="mb-3 text-[8px] bg-gray-100 p-2 rounded">
            <div className="font-semibold mb-1 text-center">
               TAX BREAKUP (GST @ 5%)
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
               <div>
                  <div className="text-[7px] text-gray-600">Taxable Amt</div>
                  <div className="font-semibold">
                     ₹{order.totalAmount?.toFixed(2)}
                  </div>
               </div>
               <div>
                  <div className="text-[7px] text-gray-600">CGST + SGST</div>
                  <div className="font-semibold">
                     ₹{order.taxes?.toFixed(2)}
                  </div>
               </div>
               <div>
                  <div className="text-[7px] text-gray-600">Total</div>
                  <div className="font-semibold">
                     ₹
                     {((order.totalAmount || 0) + (order.taxes || 0)).toFixed(
                        2,
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* ========== FOOTER ========== */}
         <div className="text-center text-[8px] space-y-2 border-t border-dashed border-gray-400 pt-2">
            <p className="font-semibold">Thank you for dining with us!</p>
            <p>Visit us again soon!</p>

            {/* Terms & Conditions */}
            <p className="text-[7px] text-gray-600 mt-2">
               * Goods once sold will not be taken back or exchanged
               <br />* Subject to Hyderabad jurisdiction only
            </p>

            {/* Declaration */}
            <p className="text-[7px] italic text-gray-500 mt-2">
               This is a computer generated invoice and does not require
               signature.
            </p>

            {/* UPI QR Code placeholder (optional) */}
            {/* <div className="mt-2">
               <img src="/qr-code.png" alt="UPI QR" className="w-16 h-16 mx-auto" />
               <p className="text-[7px]">Scan to Pay</p>
            </div> */}
         </div>

         {/* ========== POWERED BY (OPTIONAL) ========== */}
         <div className="text-center text-[7px] text-gray-400 mt-3 pt-2 border-t border-gray-300">
            Powered by YourPOS v1.0
         </div>
      </div>
   );
});
