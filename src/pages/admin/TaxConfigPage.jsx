// src/pages/admin/TaxConfigPage.jsx - Tax & Charges Configuration
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "../../lib/constants";
import { Save, RotateCcw, Eye } from "lucide-react";

const orderSources = [
   { value: "in-house", label: "🍽️ In-House Dining" },
   { value: "takeaway", label: "🥡 Takeaway" },
   { value: "online", label: "🌐 Online Orders" },
   { value: "swiggy", label: "🛵 Swiggy" },
   { value: "zomato", label: "🍕 Zomato" },
];

export default function TaxConfigPage() {
   const [configs, setConfigs] = useState([]);
   const [selectedSource, setSelectedSource] = useState("in-house");
   const [config, setConfig] = useState(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [preview, setPreview] = useState(null);
   const [previewAmount, setPreviewAmount] = useState(1000);

   useEffect(() => {
      fetchConfigs();
   }, []);

   useEffect(() => {
      if (selectedSource) {
         fetchConfig(selectedSource);
      }
   }, [selectedSource]);

   const fetchConfigs = async () => {
      try {
         const token = localStorage.getItem("adminToken");
         const res = await axios.get(`${BASE_URL}/admin/tax-config`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setConfigs(res.data.data || []);
      } catch (err) {
         if (err.response?.status === 404) {
            // Initialize if not found
            await initializeConfigs();
         } else {
            toast.error("Failed to fetch configurations");
         }
      } finally {
         setLoading(false);
      }
   };

   const initializeConfigs = async () => {
      try {
         const token = localStorage.getItem("adminToken");
         await axios.post(
            `${BASE_URL}/admin/tax-config/initialize`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success("Tax configurations initialized");
         fetchConfigs();
      } catch (err) {
         toast.error("Failed to initialize configurations");
      }
   };

   const fetchConfig = async (source) => {
      try {
         const token = localStorage.getItem("adminToken");
         const res = await axios.get(`${BASE_URL}/admin/tax-config/${source}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setConfig(res.data.data);
      } catch (err) {
         toast.error(`Failed to fetch ${source} configuration`);
      }
   };

   const handleSave = async () => {
      if (!config) return;

      setSaving(true);
      try {
         const token = localStorage.getItem("adminToken");
         await axios.put(
            `${BASE_URL}/admin/tax-config/${selectedSource}`,
            config,
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success("Configuration saved successfully");
         fetchConfigs();
      } catch (err) {
         toast.error("Failed to save configuration");
      } finally {
         setSaving(false);
      }
   };

   const handleReset = async () => {
      if (!confirm(`Reset ${selectedSource} configuration to default?`)) return;

      try {
         const token = localStorage.getItem("adminToken");
         await axios.post(
            `${BASE_URL}/admin/tax-config/${selectedSource}/reset`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
         );
         toast.success("Configuration reset to default");
         fetchConfig(selectedSource);
      } catch (err) {
         toast.error("Failed to reset configuration");
      }
   };

   const handlePreview = async () => {
      try {
         const token = localStorage.getItem("adminToken");
         const res = await axios.post(
            `${BASE_URL}/admin/tax-config/preview-calculation`,
            {
               orderSource: selectedSource,
               subtotal: parseFloat(previewAmount),
               options: {
                  itemCount: 3,
                  distance: 5,
               },
            },
            { headers: { Authorization: `Bearer ${token}` } },
         );
         setPreview(res.data.data);
      } catch (err) {
         toast.error("Failed to preview calculation");
      }
   };

   const updateConfig = (path, value) => {
      setConfig((prev) => {
         const newConfig = { ...prev };
         const keys = path.split(".");
         let current = newConfig;

         for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
         }

         current[keys[keys.length - 1]] = value;
         return newConfig;
      });
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   if (!config) {
      return (
         <div className="p-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
               No configuration found. Please initialize.
            </div>
         </div>
      );
   }

   return (
      <div className="p-6 max-w-6xl mx-auto">
         {/* Header */}
         <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
               Tax & Charges Configuration
            </h1>
            <p className="text-gray-600 mt-2">
               Manage taxes, service charges, and delivery fees for different
               order sources
            </p>
         </div>

         {/* Order Source Selector */}
         <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
               Select Order Source
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
               {orderSources.map((source) => (
                  <button
                     key={source.value}
                     onClick={() => setSelectedSource(source.value)}
                     className={`p-3 rounded-lg border-2 text-sm font-medium transition ${
                        selectedSource === source.value
                           ? "border-blue-600 bg-blue-50 text-blue-700"
                           : "border-gray-300 hover:border-gray-400"
                     }`}
                  >
                     {source.label}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
               {/* Taxes Section */}
               <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-semibold">
                        GST Configuration
                     </h2>
                     <label className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           checked={config.taxes.enabled}
                           onChange={(e) =>
                              updateConfig("taxes.enabled", e.target.checked)
                           }
                           className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Enable</span>
                     </label>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           CGST (%)
                        </label>
                        <input
                           type="number"
                           value={config.taxes.cgst}
                           onChange={(e) =>
                              updateConfig(
                                 "taxes.cgst",
                                 parseFloat(e.target.value),
                              )
                           }
                           disabled={!config.taxes.enabled}
                           className="w-full p-2 border rounded-md"
                           step="0.1"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           SGST (%)
                        </label>
                        <input
                           type="number"
                           value={config.taxes.sgst}
                           onChange={(e) =>
                              updateConfig(
                                 "taxes.sgst",
                                 parseFloat(e.target.value),
                              )
                           }
                           disabled={!config.taxes.enabled}
                           className="w-full p-2 border rounded-md"
                           step="0.1"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           IGST (%)
                        </label>
                        <input
                           type="number"
                           value={config.taxes.igst}
                           onChange={(e) =>
                              updateConfig(
                                 "taxes.igst",
                                 parseFloat(e.target.value),
                              )
                           }
                           disabled={!config.taxes.enabled}
                           className="w-full p-2 border rounded-md"
                           step="0.1"
                        />
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                     ℹ️ Use CGST+SGST for intra-state, IGST for inter-state
                  </p>
               </div>

               {/* Service Charge Section */}
               <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-semibold">Service Charge</h2>
                     <label className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           checked={config.serviceCharge.enabled}
                           onChange={(e) =>
                              updateConfig(
                                 "serviceCharge.enabled",
                                 e.target.checked,
                              )
                           }
                           className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Enable</span>
                     </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Type
                        </label>
                        <select
                           value={config.serviceCharge.type}
                           onChange={(e) =>
                              updateConfig("serviceCharge.type", e.target.value)
                           }
                           disabled={!config.serviceCharge.enabled}
                           className="w-full p-2 border rounded-md"
                        >
                           <option value="percentage">Percentage</option>
                           <option value="flat">Flat Amount</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Value
                        </label>
                        <input
                           type="number"
                           value={config.serviceCharge.value}
                           onChange={(e) =>
                              updateConfig(
                                 "serviceCharge.value",
                                 parseFloat(e.target.value),
                              )
                           }
                           disabled={!config.serviceCharge.enabled}
                           className="w-full p-2 border rounded-md"
                        />
                     </div>
                  </div>
               </div>

               {/* Delivery Charges Section */}
               <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-semibold">Delivery Charges</h2>
                     <label className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           checked={config.deliveryCharges.enabled}
                           onChange={(e) =>
                              updateConfig(
                                 "deliveryCharges.enabled",
                                 e.target.checked,
                              )
                           }
                           className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Enable</span>
                     </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Type
                        </label>
                        <select
                           value={config.deliveryCharges.type}
                           onChange={(e) =>
                              updateConfig(
                                 "deliveryCharges.type",
                                 e.target.value,
                              )
                           }
                           disabled={!config.deliveryCharges.enabled}
                           className="w-full p-2 border rounded-md"
                        >
                           <option value="flat">Flat Amount</option>
                           <option value="percentage">Percentage</option>
                           <option value="distance-based">
                              Distance Based
                           </option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Value
                        </label>
                        <input
                           type="number"
                           value={config.deliveryCharges.value}
                           onChange={(e) =>
                              updateConfig(
                                 "deliveryCharges.value",
                                 parseFloat(e.target.value),
                              )
                           }
                           disabled={!config.deliveryCharges.enabled}
                           className="w-full p-2 border rounded-md"
                        />
                     </div>
                  </div>

                  {config.deliveryCharges.type === "distance-based" && (
                     <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Per KM (₹)
                           </label>
                           <input
                              type="number"
                              value={config.deliveryCharges.perKm}
                              onChange={(e) =>
                                 updateConfig(
                                    "deliveryCharges.perKm",
                                    parseFloat(e.target.value),
                                 )
                              }
                              className="w-full p-2 border rounded-md"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Minimum (₹)
                           </label>
                           <input
                              type="number"
                              value={config.deliveryCharges.minimumCharge}
                              onChange={(e) =>
                                 updateConfig(
                                    "deliveryCharges.minimumCharge",
                                    parseFloat(e.target.value),
                                 )
                              }
                              className="w-full p-2 border rounded-md"
                           />
                        </div>
                     </div>
                  )}
               </div>

               {/* Packaging Charges Section */}
               <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-semibold">
                        Packaging Charges
                     </h2>
                     <label className="flex items-center gap-2">
                        <input
                           type="checkbox"
                           checked={config.packagingCharges.enabled}
                           onChange={(e) =>
                              updateConfig(
                                 "packagingCharges.enabled",
                                 e.target.checked,
                              )
                           }
                           className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Enable</span>
                     </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Type
                        </label>
                        <select
                           value={config.packagingCharges.type}
                           onChange={(e) =>
                              updateConfig(
                                 "packagingCharges.type",
                                 e.target.value,
                              )
                           }
                           disabled={!config.packagingCharges.enabled}
                           className="w-full p-2 border rounded-md"
                        >
                           <option value="flat">Flat Amount</option>
                           <option value="percentage">Percentage</option>
                           <option value="per-item">Per Item</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Value
                        </label>
                        <input
                           type="number"
                           value={config.packagingCharges.value}
                           onChange={(e) =>
                              updateConfig(
                                 "packagingCharges.value",
                                 parseFloat(e.target.value),
                              )
                           }
                           disabled={!config.packagingCharges.enabled}
                           className="w-full p-2 border rounded-md"
                        />
                     </div>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex gap-3">
                  <button
                     onClick={handleSave}
                     disabled={saving}
                     className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                  >
                     <Save size={20} />
                     {saving ? "Saving..." : "Save Configuration"}
                  </button>
                  <button
                     onClick={handleReset}
                     className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
                  >
                     <RotateCcw size={20} />
                     Reset
                  </button>
               </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4">
                     💰 Preview Calculation
                  </h2>

                  <div className="mb-4">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtotal Amount (₹)
                     </label>
                     <input
                        type="number"
                        value={previewAmount}
                        onChange={(e) => setPreviewAmount(e.target.value)}
                        className="w-full p-2 border rounded-md"
                     />
                  </div>

                  <button
                     onClick={handlePreview}
                     className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 mb-4"
                  >
                     <Eye size={18} />
                     Calculate
                  </button>

                  {preview && (
                     <div className="space-y-2 text-sm border-t pt-4">
                        <div className="flex justify-between">
                           <span>Subtotal:</span>
                           <span className="font-semibold">
                              ₹{preview.breakdown.subtotal}
                           </span>
                        </div>
                        {preview.breakdown.cgst > 0 && (
                           <div className="flex justify-between text-gray-600">
                              <span>CGST:</span>
                              <span>₹{preview.breakdown.cgst}</span>
                           </div>
                        )}
                        {preview.breakdown.sgst > 0 && (
                           <div className="flex justify-between text-gray-600">
                              <span>SGST:</span>
                              <span>₹{preview.breakdown.sgst}</span>
                           </div>
                        )}
                        {preview.breakdown.serviceCharge > 0 && (
                           <div className="flex justify-between text-gray-600">
                              <span>Service Charge:</span>
                              <span>₹{preview.breakdown.serviceCharge}</span>
                           </div>
                        )}
                        {preview.breakdown.deliveryCharges > 0 && (
                           <div className="flex justify-between text-gray-600">
                              <span>Delivery:</span>
                              <span>₹{preview.breakdown.deliveryCharges}</span>
                           </div>
                        )}
                        {preview.breakdown.packagingCharges > 0 && (
                           <div className="flex justify-between text-gray-600">
                              <span>Packaging:</span>
                              <span>₹{preview.breakdown.packagingCharges}</span>
                           </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                           <span>Grand Total:</span>
                           <span className="text-green-600">
                              ₹{preview.breakdown.grandTotal}
                           </span>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
