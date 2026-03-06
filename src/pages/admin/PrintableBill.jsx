// src/components/admin/PrintableBill.jsx - LEGALLY COMPLIANT INDIAN BILL
// Now accepts EITHER a `bill` snapshot (preferred, from Bills collection)
// OR falls back to `order` fields for backwards compatibility.
// Always prefer passing `bill` — it's the locked immutable record.
import React from "react";

export const PrintableBill = React.forwardRef(({ order, bill }, ref) => {
   // Prefer bill snapshot; fall back to order for any missing fields
   const src = bill || order;
   if (!src) return null;

   // ── Charges ────────────────────────────────────────────────────────────
   const subtotal = src.subtotal ?? src.totalAmount ?? 0;
   const cgst = src.cgst ?? 0;
   const sgst = src.sgst ?? 0;
   const igst = src.igst ?? 0;
   const totalTax = src.totalTax ?? src.taxes ?? 0;
   const serviceCharge = src.serviceCharge ?? 0;
   const serviceChargeWaived = src.serviceChargeWaived ?? false;
   const packagingCharges = src.packagingCharges ?? 0;
   const deliveryCharges = src.deliveryCharges ?? 0;
   const discount = src.discount ?? src.discountAmount ?? 0;
   const roundOff = src.roundOff ?? 0;
   const grandTotal = src.grandTotal ?? src.finalAmount ?? 0;

   // ── Rates (use stored % from Bill snapshot; back-calculate if not present) ─
   const cgstRate =
      src.cgstRate ??
      (subtotal > 0 ? ((cgst / subtotal) * 100).toFixed(1) : 2.5);
   const sgstRate =
      src.sgstRate ??
      (subtotal > 0 ? ((sgst / subtotal) * 100).toFixed(1) : 2.5);
   const igstRate =
      src.igstRate ?? (subtotal > 0 ? ((igst / subtotal) * 100).toFixed(1) : 0);
   const scRate =
      src.serviceChargeRate ??
      (subtotal > 0 ? ((serviceCharge / subtotal) * 100).toFixed(1) : 0);
   const totalGstRate =
      parseFloat(cgstRate) + parseFloat(sgstRate) + parseFloat(igstRate);

   // ── Items (use bill snapshot items if available) ──────────────────────
   const items = src.items ?? [];

   // ── Identity ──────────────────────────────────────────────────────────
   const billNumber =
      bill?.billNumber ??
      `B${new Date().getFullYear()}-${String(src.orderNumber).split("-")[2] || "001"}`;
   const tableNumber = src.tableNumber ?? "N/A";
   const customerName = src.customerName ?? null;
   const orderSource = src.orderSource ?? src.orderSource ?? "IN-HOUSE";
   const paymentMethod = src.paymentMethod ?? order?.paymentMethod ?? "CASH";
   const paymentStatus =
      bill?.paymentStatus === "paid"
         ? "COMPLETED"
         : (order?.paymentStatus?.toUpperCase() ?? "PENDING");

   return (
      <div
         ref={ref}
         className="p-6 bg-white text-black font-mono w-[80mm] mx-auto text-[10px] leading-tight"
      >
         {/* ── HEADER ─────────────────────────────────────────────────────── */}
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
               Phone: +91 62645 88151 | Email: loveatfirstbyte.437@gmail.com
            </p>
         </div>

         {/* ── LEGAL INFO ─────────────────────────────────────────────────── */}
         <div className="text-center mb-3 pb-2 border-b border-dashed border-gray-400">
            <div className="grid grid-cols-2 gap-1 text-[8px]">
               <div className="text-left">
                  <strong>GSTIN:</strong> 36BTSPP2167F1Z9
               </div>
               <div className="text-right">
                  <strong>FSSAI:</strong> 23625032007297
               </div>
            </div>
            <div className="text-[8px] mt-1">
               <strong>SAC Code:</strong> 996331 (Restaurant Services)
            </div>
         </div>

         {/* ── INVOICE DETAILS ────────────────────────────────────────────── */}
         <div className="mb-3 text-[9px]">
            <div className="grid grid-cols-2 gap-1">
               <div>
                  <strong>Invoice No:</strong> {billNumber}
               </div>
               <div className="text-right">
                  <strong>Table:</strong> {tableNumber}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
               <div>
                  <strong>Date:</strong>{" "}
                  {new Date(bill?.generatedAt ?? new Date()).toLocaleDateString(
                     "en-GB",
                  )}
               </div>
               <div className="text-right">
                  <strong>Time:</strong>{" "}
                  {new Date(bill?.generatedAt ?? new Date()).toLocaleTimeString(
                     "en-IN",
                     {
                        hour: "2-digit",
                        minute: "2-digit",
                     },
                  )}
               </div>
            </div>
            {customerName && (
               <div className="mt-1">
                  <strong>Customer:</strong> {customerName}
               </div>
            )}
            <div className="mt-1">
               <strong>Order Type:</strong> {orderSource?.toUpperCase()}
            </div>
         </div>

         {/* ── ITEMS TABLE ─────────────────────────────────────────────────── */}
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
               {items.map((item, idx) => {
                  // Support both Bill snapshot shape and Order item shape
                  const itemName = item.name;
                  const qty = item.quantity;
                  const rate = item.basePrice ?? item.price ?? 0;
                  const addons = item.selectedAddons ?? [];
                  const addonSum = addons.reduce(
                     (s, a) => s + (a.price ?? 0),
                     0,
                  );
                  const lineTotal = item.unitTotal ?? (rate + addonSum) * qty;

                  return (
                     <tr key={idx} className="border-b border-gray-300">
                        <td className="py-1 pr-1">
                           {itemName}
                           {addons.length > 0 && (
                              <div className="text-[7px] text-gray-500 mt-0.5">
                                 {addons.map((a, i) => (
                                    <div key={i}>
                                       <span>+ {a.name}</span>
                                       <span>
                                          {"  "}₹{a.price}
                                       </span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </td>
                        <td className="text-center px-1">{qty}</td>
                        <td className="text-right px-1">₹{rate}</td>
                        <td className="text-right pl-1">
                           ₹{lineTotal.toFixed(2)}
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>

         {/* ── AMOUNT BREAKDOWN ────────────────────────────────────────────── */}
         <div className="mb-3 text-[9px] border-b border-dashed border-gray-400 pb-2">
            <div className="flex justify-between py-0.5">
               <span>Subtotal:</span>
               <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {cgst > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>CGST @ {cgstRate}%:</span>
                  <span>₹{cgst.toFixed(2)}</span>
               </div>
            )}
            {sgst > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>SGST @ {sgstRate}%:</span>
                  <span>₹{sgst.toFixed(2)}</span>
               </div>
            )}
            {igst > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>IGST @ {igstRate}%:</span>
                  <span>₹{igst.toFixed(2)}</span>
               </div>
            )}

            {serviceCharge > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>Service Charge ({scRate}%):</span>
                  <span>₹{serviceCharge.toFixed(2)}</span>
               </div>
            )}
            {serviceChargeWaived && (
               <div className="flex justify-between py-0.5 text-green-700">
                  <span>Service Charge:</span>
                  <span>WAIVED</span>
               </div>
            )}

            {packagingCharges > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>Packaging:</span>
                  <span>₹{packagingCharges.toFixed(2)}</span>
               </div>
            )}
            {deliveryCharges > 0 && (
               <div className="flex justify-between py-0.5">
                  <span>Delivery:</span>
                  <span>₹{deliveryCharges.toFixed(2)}</span>
               </div>
            )}
            {discount > 0 && (
               <div className="flex justify-between py-0.5 text-red-600">
                  <span>Discount:</span>
                  <span>-₹{discount.toFixed(2)}</span>
               </div>
            )}
            {roundOff !== 0 && (
               <div className="flex justify-between py-0.5">
                  <span>Round Off:</span>
                  <span>
                     {roundOff > 0 ? "+" : ""}₹{roundOff.toFixed(2)}
                  </span>
               </div>
            )}
         </div>

         {/* ── GRAND TOTAL ─────────────────────────────────────────────────── */}
         <div className="mb-3 border-t-2 border-b-2 border-black py-2">
            <div className="flex justify-between text-sm font-bold">
               <span>GRAND TOTAL:</span>
               <span>₹{grandTotal.toFixed(2)}</span>
            </div>
         </div>

         {/* ── PAYMENT INFO ─────────────────────────────────────────────────── */}
         <div className="mb-3 text-[8px] pb-2 border-b border-dashed border-gray-400">
            <div className="flex justify-between">
               <span>Payment Mode:</span>
               <span className="font-semibold uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between mt-1">
               <span>Payment Status:</span>
               <span
                  className={`font-semibold ${paymentStatus === "COMPLETED" ? "text-green-600" : "text-orange-600"}`}
               >
                  {paymentStatus}
               </span>
            </div>
            {bill?.billNumber && (
               <div className="flex justify-between mt-1 text-gray-500">
                  <span>Bill Ref:</span>
                  <span>{bill.billNumber}</span>
               </div>
            )}
         </div>

         {/* ── TAX SUMMARY ─────────────────────────────────────────────────── */}
         <div className="mb-3 text-[8px] bg-gray-100 p-2 rounded">
            <div className="font-semibold mb-1 text-center">
               TAX BREAKUP (GST @ {totalGstRate}%)
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
               <div>
                  <div className="text-[7px] text-gray-600">Taxable Amt</div>
                  <div className="font-semibold">₹{subtotal.toFixed(2)}</div>
               </div>
               <div>
                  <div className="text-[7px] text-gray-600">CGST + SGST</div>
                  <div className="font-semibold">₹{totalTax.toFixed(2)}</div>
               </div>
               <div>
                  <div className="text-[7px] text-gray-600">Total</div>
                  <div className="font-semibold">
                     ₹{(subtotal + totalTax).toFixed(2)}
                  </div>
               </div>
            </div>
         </div>

         {/* ── FOOTER ──────────────────────────────────────────────────────── */}
         <div className="text-center text-[8px] space-y-2 border-t border-dashed border-gray-400 pt-2">
            <p className="font-semibold">Thank you for dining with us!</p>
            <p>Visit us again soon!</p>
            <p className="text-[7px] text-gray-600 mt-2">
               * Goods once sold will not be taken back or exchanged
               <br />* Subject to Hyderabad jurisdiction only
            </p>
            <p className="text-[7px] italic text-gray-500 mt-2">
               This is a computer generated invoice and does not require
               signature.
            </p>
         </div>

         <div className="text-center text-[7px] text-gray-400 mt-3 pt-2 border-t border-gray-300">
            Powered by YourPOS v1.0
         </div>
      </div>
   );
});
