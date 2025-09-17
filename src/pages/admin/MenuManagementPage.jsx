"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2 } from "lucide-react";

// A simple modal component
const MenuModal = ({ item, onClose, onSave }) => {
   const [formData, setFormData] = useState(
      item || {
         name: "",
         description: "",
         price: 0,
         image: "/cafe/default.jpg", // Default image
         category: "Quick Bites",
         section: "Quick Bites",
         preparationTime: 10,
         isAvailable: true,
      }
   );

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
         <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
               {item ? "Edit Menu Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Name */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Item Name*
                  </label>
                  <input
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     placeholder="Eg: Fries Before Guys"
                     required
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Description */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Description*
                  </label>
                  <textarea
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     placeholder="Short description of the dish"
                     required
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Price */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Price (₹)*
                  </label>
                  <input
                     type="number"
                     name="price"
                     value={formData.price}
                     onChange={handleChange}
                     required
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Category */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Category*
                  </label>
                  <input
                     name="category"
                     value={formData.category}
                     onChange={handleChange}
                     placeholder="Eg: Small Bytes, Gourmet Salads"
                     required
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Section */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Section* (Veg/Non-Veg)
                  </label>
                  <input
                     name="section"
                     value={formData.section}
                     onChange={handleChange}
                     placeholder="Eg: Quick Bites, Comfort Meals"
                     required
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Preparation Time */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Preparation Time (mins)
                  </label>
                  <input
                     type="number"
                     name="preparationTime"
                     value={formData.preparationTime}
                     onChange={handleChange}
                     required
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Availability */}
               <div className="flex items-center space-x-2">
                  <input
                     type="checkbox"
                     name="isAvailable"
                     checked={formData.isAvailable}
                     onChange={handleChange}
                  />
                  <label className="text-sm font-medium text-gray-700">
                     Available?
                  </label>
               </div>

               {/* Image URL */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Image URL
                  </label>
                  <input
                     name="image"
                     value={formData.image}
                     onChange={handleChange}
                     placeholder="Eg: https://example.com/images/fries.jpg"
                     required
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Spice Level */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Spice Level (1-5)
                  </label>
                  <input
                     type="number"
                     name="spiceLevel"
                     min="1"
                     max="5"
                     value={formData.spiceLevel}
                     onChange={handleChange}
                     className="w-full p-2 border rounded"
                  />
               </div>
               {/* Menu Order */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Menu Order (ranking)
                  </label>
                  <input
                     type="number"
                     name="menuOrder"
                     min="1"
                     max="99"
                     value={formData.menuOrder}
                     onChange={handleChange}
                     className="w-full p-2 border rounded"
                  />
               </div>
               {/* Servings */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Servings
                  </label>
                  <input
                     name="servings"
                     value={formData.servings}
                     onChange={handleChange}
                     placeholder="Eg: 1 plate, 2 bowls"
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Dietary Options */}
               <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                     Dietary Options
                  </label>
                  <div className="flex space-x-4">
                     <label>
                        <input
                           type="checkbox"
                           name="isVegetarian"
                           checked={formData.isVegetarian}
                           onChange={handleChange}
                        />{" "}
                        Vegetarian
                     </label>
                     <label>
                        <input
                           type="checkbox"
                           name="isVegan"
                           checked={formData.isVegan}
                           onChange={handleChange}
                        />{" "}
                        Vegan
                     </label>
                     <label>
                        <input
                           type="checkbox"
                           name="isGlutenFree"
                           checked={formData.isGlutenFree}
                           onChange={handleChange}
                        />{" "}
                        Gluten Free
                     </label>
                  </div>
               </div>

               {/* Ingredients */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Ingredients (comma separated)
                  </label>
                  <input
                     name="ingredients"
                     value={formData.ingredients?.join(", ") || ""}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           ingredients: e.target.value
                              .split(",")
                              .map((i) => i.trim()),
                        }))
                     }
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Allergens */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Allergens (comma separated)
                  </label>
                  <input
                     name="allergens"
                     value={formData.allergens?.join(", ") || ""}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           allergens: e.target.value
                              .split(",")
                              .map((a) => a.trim()),
                        }))
                     }
                     className="w-full p-2 border rounded"
                  />
               </div>

               {/* Nutrition Info */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Nutrition Info
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                     <input
                        type="number"
                        placeholder="Calories"
                        value={formData.nutritionInfo?.calories || ""}
                        onChange={(e) =>
                           setFormData((prev) => ({
                              ...prev,
                              nutritionInfo: {
                                 ...prev.nutritionInfo,
                                 calories: +e.target.value,
                              },
                           }))
                        }
                        className="p-2 border rounded"
                     />
                     <input
                        type="number"
                        placeholder="Protein (g)"
                        value={formData.nutritionInfo?.protein || ""}
                        onChange={(e) =>
                           setFormData((prev) => ({
                              ...prev,
                              nutritionInfo: {
                                 ...prev.nutritionInfo,
                                 protein: +e.target.value,
                              },
                           }))
                        }
                        className="p-2 border rounded"
                     />
                     <input
                        type="number"
                        placeholder="Carbs (g)"
                        value={formData.nutritionInfo?.carbs || ""}
                        onChange={(e) =>
                           setFormData((prev) => ({
                              ...prev,
                              nutritionInfo: {
                                 ...prev.nutritionInfo,
                                 carbs: +e.target.value,
                              },
                           }))
                        }
                        className="p-2 border rounded"
                     />
                     <input
                        type="number"
                        placeholder="Fat (g)"
                        value={formData.nutritionInfo?.fat || ""}
                        onChange={(e) =>
                           setFormData((prev) => ({
                              ...prev,
                              nutritionInfo: {
                                 ...prev.nutritionInfo,
                                 fat: +e.target.value,
                              },
                           }))
                        }
                        className="p-2 border rounded"
                     />
                  </div>
               </div>

               {/* Tags */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Tags (comma separated)
                  </label>
                  <input
                     name="tags"
                     placeholder="popular, new, bestseller, spicy, bestseller etc"
                     value={formData.tags?.join(", ") || ""}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           tags: e.target.value.split(",").map((t) => t.trim()),
                        }))
                     }
                     className="w-full p-2 border rounded"
                  />
               </div>

               <div className="flex justify-end space-x-4">
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-4 py-2 text-gray-600 bg-gray-200 rounded"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="px-4 py-2 text-white bg-indigo-600 rounded"
                  >
                     Save
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default function MenuManagementPage() {
   const [menuItems, setMenuItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingItem, setEditingItem] = useState(null);

   const API_BASE_URL = "http://localhost:9999/api/admin/menu";

   const fetchMenuItems = async () => {
      setLoading(true);
      try {
         const token = localStorage.getItem("adminToken");
         const response = await axios.get(API_BASE_URL, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setMenuItems(response.data.data);
      } catch (err) {
         setError("Failed to fetch menu items.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchMenuItems();
   }, []);

   const handleSave = async (itemData) => {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
         if (itemData._id) {
            // Update existing item
            await axios.put(
               `${API_BASE_URL}/${itemData._id}`,
               itemData,
               config
            );
         } else {
            // Create new item
            await axios.post(API_BASE_URL, itemData, config);
         }
         setIsModalOpen(false);
         setEditingItem(null);
         fetchMenuItems(); // Refresh data
      } catch (err) {
         setError("Failed to save menu item.");
      }
   };

   const handleToggleAvailability = async (item) => {
      const token = localStorage.getItem("adminToken");
      try {
         await axios.patch(
            `${API_BASE_URL}/${item._id}/availability`,
            { isAvailable: !item.isAvailable },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         fetchMenuItems(); // Refresh data
      } catch (err) {
         setError("Failed to update availability.");
      }
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
               Menu Management
            </h1>
            <button
               onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
               }}
               className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
               <Plus size={20} className="mr-2" /> Add New Item
            </button>
         </div>

         {isModalOpen && (
            <MenuModal
               item={editingItem}
               onClose={() => setIsModalOpen(false)}
               onSave={handleSave}
            />
         )}

         {loading && <p>Loading menu...</p>}
         {error && <p className="text-red-500">{error}</p>}

         <div className="bg-white rounded-lg shadow-md p-4">
            <div className="overflow-x-auto">
               <table className="min-w-full">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                           Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                           Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                           Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                           Section
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                           Available
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {menuItems.map((item) => (
                        <tr key={item._id}>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{item.price}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.category}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.section}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                 onClick={() => handleToggleAvailability(item)}
                                 className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    item.isAvailable
                                       ? "bg-green-100 text-green-800"
                                       : "bg-red-100 text-red-800"
                                 }`}
                              >
                                 {item.isAvailable ? "Yes" : "No"}
                              </button>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                              <button
                                 onClick={() => {
                                    setEditingItem(item);
                                    setIsModalOpen(true);
                                 }}
                                 className="text-indigo-600 hover:text-indigo-900"
                              >
                                 <Edit size={18} />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
