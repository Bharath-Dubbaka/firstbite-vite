import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserDetails } from "../store/slices/firebaseSlice";

import axios from "axios";
import { apiClient } from "../services/apiClient";
import { getDistanceFromLatLonInKm } from "../services/geolocation";
// Define your business location and delivery radius
const YOUR_LOCATION = {
   latitude: 17.4399, // Example: secbad latitude
   longitude: 78.4983, // Example: secbad longitude

   // latitude: 18.498989, // Example: Vijayawada longitude
   // longitude: 75.667427, // Example: Vijayawada longitude

   // latitude: 17.5842, // Example: Yadagiri longitude
   // longitude: 78.9461, // Example: Yadagiri longitude
};
const MAX_DELIVERY_RADIUS_KM = 40;

const AddressModal = ({ addresses = [], onSelect, onClose }) => {
   const dispatch = useDispatch();

   //    const { user } = useSelector((state) => state.auth);
   const [showAddNew, setShowAddNew] = useState(false);
   const [saving, setSaving] = useState(false);
   const [newAddress, setNewAddress] = useState({
      label: "Home",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      latitude: null,
      longitude: null,
   });
   const [locationError, setLocationError] = useState(""); // State for error messages

   const handleInputChange = (field, value) => {
      setNewAddress((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   // 4. Function to get user's location and check radius
   const handlePinLocation = () => {
      if (!navigator.geolocation) {
         setLocationError("Geolocation is not supported by your browser.");
         return;
      }

      setSaving(true);
      setLocationError("");

      navigator.geolocation.getCurrentPosition(
         (position) => {
            const { latitude, longitude } = position.coords;

            const distance = getDistanceFromLatLonInKm(
               YOUR_LOCATION.latitude,
               YOUR_LOCATION.longitude,
               latitude,
               longitude
            );

            if (distance > MAX_DELIVERY_RADIUS_KM) {
               setLocationError(
                  `Sorry, we only deliver within ${MAX_DELIVERY_RADIUS_KM}km. You are ~${Math.round(
                     distance
                  )}km away.`
               );
               console.log(latitude, longitude, "latitude longitude");
               setSaving(false);
               return;
            }

            // Location is valid, store coordinates and show the form
            setNewAddress((prev) => ({
               ...prev,
               latitude,
               longitude,
            }));
            setShowAddNew(true);
            setSaving(false);
         },
         (error) => {
            // --- THIS IS THE UPDATED PART ---
            console.error("Geolocation Error:", error); // Keep this for detailed logs
            let message =
               "Could not get your location. Please try again. Please enable Location access in your browser settings.";

            if (error.code === 1) {
               // PERMISSION_DENIED
               message =
                  "Location access was denied. Please enable it in your browser settings.";
            } else if (error.code === 2) {
               // POSITION_UNAVAILABLE
               message =
                  "Your location could not be determined. Please check your network connection and OS location settings.";
            } else if (error.code === 3) {
               // TIMEOUT
               message =
                  "Getting your location took too long. Please try again.";
            }
            setLocationError(message);
            setSaving(false);
         },
         {
            // Optional: Add options for better accuracy
            enableHighAccuracy: true, // Requests GPS if available
            timeout: 10000, // 10 seconds
            maximumAge: 0, // Don't use cached location
         }
      );
   };

   const handleSave = async () => {
      // Validate required fields
      if (
         !newAddress.addressLine1.trim() ||
         !newAddress.city.trim() ||
         !newAddress.state.trim() ||
         !newAddress.pincode.trim()
      ) {
         alert(
            "Please fill all required fields (Address Line 1, City, State, Pincode)"
         );
         return;
      }
      // Ensure coordinates are present before saving
      if (!newAddress.latitude || !newAddress.longitude) {
         alert("Location not pinned. Please use the location picker.");
         return;
      }
      try {
         setSaving(true);

         //using apiClient utility that handles token retrieval
         const response = await apiClient("/post/user-details", "POST", {
            addresses: [...addresses, newAddress],
         });

         // Update Redux store
         dispatch(updateUserDetails(response));

         // Select the newly added address
         onSelect(newAddress);

         //  // Get token from firebase auth instance
         //  const currentUser = auth.currentUser;
         //  if (!currentUser) {
         //     throw new Error("User not authenticated");
         //  }

         //  const token = await currentUser.getIdToken();

         //  // Send new address to backend
         //  const response = await axios.post(
         //     "/api/post/user-details",
         //     {
         //        addresses: [...addresses, newAddress], // Add new address to existing ones
         //     },
         //     {
         //        headers: { Authorization: `Bearer ${token}` },
         //     }
         //  );

         //  if (response.data.success) {
         //     // Update Redux store with new user details
         //     dispatch(updateUserDetails(response.data.data));

         //     // Select the newly added address
         //     onSelect(newAddress);
         //  } else {
         //     throw new Error(response.data.message || "Failed to save address");
         //  }
      } catch (error) {
         console.error("Error saving address:", error);
         alert(
            "Failed to save address: " +
               (error.response?.data?.message || error.message)
         );
      } finally {
         setSaving(false);
      }
   };

   const resetForm = () => {
      setNewAddress({
         label: "Home",
         addressLine1: "",
         addressLine2: "",
         city: "",
         state: "",
         pincode: "",
         landmark: "",
         latitude: null, // Reset coordinates
         longitude: null,
      });
      setShowAddNew(false);
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Choose Address</h2>

            {!showAddNew ? (
               <>
                  {/* Show existing addresses */}
                  {addresses && addresses.length > 0 ? (
                     <div className="space-y-2 mb-4">
                        {addresses.map((addr, i) => (
                           <div
                              key={addr._id || i}
                              className="border p-3 rounded mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => onSelect(addr)}
                           >
                              <p className="font-semibold text-green-600">
                                 {addr.label}
                              </p>
                              <p className="text-sm">{addr.addressLine1}</p>
                              {addr.addressLine2 && (
                                 <p className="text-sm">{addr.addressLine2}</p>
                              )}
                              <p className="text-sm">
                                 {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              {addr.landmark && (
                                 <p className="text-xs text-gray-500">
                                    Near: {addr.landmark}
                                 </p>
                              )}
                           </div>
                        ))}
                     </div>
                  ) : (
                     <p className="text-gray-500 mb-4">
                        No saved addresses found
                     </p>
                  )}

                  <button
                     onClick={handlePinLocation}
                     disabled={saving}
                     className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                     {saving ? "Getting Location..." : "+ Add New Address"}
                  </button>

                  {/* 7. Display any location errors */}
                  {locationError && (
                     <p className="text-red-500 text-sm mt-2 text-center">
                        {locationError}
                     </p>
                  )}
               </>
            ) : (
               <>
                  {/* 8. Show a success message when location is pinned */}
                  <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg mb-4 text-center">
                     <p className="font-semibold">
                        Location Pinned Successfully!
                     </p>
                     <p className="text-sm">
                        Please fill in the details below.
                     </p>
                  </div>

                  {/* Add new address form */}
                  <div className="space-y-3">
                     <input
                        type="text"
                        placeholder="Label (Home/Office/etc)*"
                        value={newAddress.label}
                        onChange={(e) =>
                           handleInputChange("label", e.target.value)
                        }
                        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <input
                        type="text"
                        placeholder="Address Line 1*"
                        value={newAddress.addressLine1}
                        onChange={(e) =>
                           handleInputChange("addressLine1", e.target.value)
                        }
                        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <input
                        type="text"
                        placeholder="Address Line 2"
                        value={newAddress.addressLine2}
                        onChange={(e) =>
                           handleInputChange("addressLine2", e.target.value)
                        }
                        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <div className="flex gap-2">
                        <input
                           type="text"
                           placeholder="City*"
                           value={newAddress.city}
                           onChange={(e) =>
                              handleInputChange("city", e.target.value)
                           }
                           className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                           type="text"
                           placeholder="State*"
                           value={newAddress.state}
                           onChange={(e) =>
                              handleInputChange("state", e.target.value)
                           }
                           className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                     <div className="flex gap-2">
                        <input
                           type="text"
                           placeholder="Pincode*"
                           value={newAddress.pincode}
                           onChange={(e) =>
                              handleInputChange("pincode", e.target.value)
                           }
                           className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                           type="text"
                           placeholder="Landmark"
                           value={newAddress.landmark}
                           onChange={(e) =>
                              handleInputChange("landmark", e.target.value)
                           }
                           className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                     <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                     >
                        {saving ? "Saving..." : "Save Address"}
                     </button>
                     <button
                        onClick={resetForm}
                        className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition-colors"
                     >
                        Cancel
                     </button>
                  </div>
               </>
            )}

            <button
               onClick={onClose}
               className="mt-4 w-full border py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
               Close
            </button>
         </div>
      </div>
   );
};

export default AddressModal;
