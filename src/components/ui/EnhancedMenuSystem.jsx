import React, { useState, useEffect } from "react";
import axios from "axios";
import {
   Plus,
   ShoppingCart,
   Star,
   Clock,
   Flame,
   Coffee,
   Utensils,
   X,
   Eye,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../lib/constants";
// DabbaMenu remains hardcoded as requested
const dabbaMenu = [
   {
      title: "Comfort Meals",
      items: [
         {
            name: "Pav Bhaji",
            price: 199,
            desc: "Bombay-style bhaji + 2 Pavs + Onions.",
            image: "/lunch_box_two.png",
            rating: 4.6,
            servings: "2-3",
            spiceLevel: 3,
         },
         {
            name: "Mysore Curd Rice Meal",
            price: 199,
            desc: "Curd-rice + Papad + Pickle + Onions.",
            image: "/lunch_box.png",
            rating: 4.4,
            servings: "1-2",
            spiceLevel: 1,
         },
      ],
   },
   {
      title: "Thali Combos",
      items: [
         {
            name: "North Indian Thali",
            price: 249,
            desc: "Roti + Rice + Dal + Sabzi + Salad.",
            image: "/lunch_box_two.png",
            rating: 4.7,
            servings: "2-3",
            spiceLevel: 2,
         },
      ],
   },
];

function SpicyIndicator({ level }) {
   return (
      <div className="flex items-center gap-1">
         {[...Array(3)].map((_, i) => (
            <Flame
               key={i}
               className={`w-3 h-3 ${
                  i < level ? "text-red-500" : "text-gray-300"
               }`}
               fill={i < level ? "currentColor" : "none"}
            />
         ))}
      </div>
   );
}

// HELPER FOR IMGS FOR NOW
const localCafeImages = [
   "/cafe/coffee.jpg",
   "/cafe/fries.jpg",
   "/cafe/latte.jpg",
   "/cafe/pancakes.jpg",
];

// Helper to get correct image
function getCafeImage(item, index) {
   if (item.image?.startsWith("https://example.com")) {
      // Rotate between the 4 local images
      return localCafeImages[index % localCafeImages.length];
   }
   return item.image;
}

// details modal
const MenuDetailModal = ({ item, onClose }) => {
   if (!item) return null;

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
         onClick={onClose}
      >
         <div
            className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
         >
            <button
               onClick={onClose}
               className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
               <X size={24} />
            </button>
            <img
               src={getCafeImage(item, Math.floor(Math.random() * 20) + 1)}
               alt={item.name}
               className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-800">{item.name}</h2>
            <div className="flex items-center my-2 space-x-4">
               <span className="text-2xl font-bold text-green-700">
                  ₹{item.price}
               </span>
               <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />{" "}
                  {item.rating}
               </div>
            </div>
            <p className="text-gray-600 my-4">
               {item.description || item.desc}
            </p>
            {/* You can add more details here later, like ingredients or allergens */}
         </div>
      </div>
   );
};

function MenuCard({ item, onAdd, onShowDetails, type = "cafe" }) {
   const [isAdding, setIsAdding] = useState(false);
   const dispatch = useDispatch();

   const handleAdd = (e) => {
      e.stopPropagation(); // Prevent event bubbling
      setIsAdding(true);
      setTimeout(() => setIsAdding(false), 600);
      onAdd(item); // Pass the item, not the event
   };

   const handleImageClick = (e) => {
      e.stopPropagation(); // Prevent event bubbling
      onShowDetails(item);
   };

   const handleViewMore = (e) => {
      e.stopPropagation(); // Prevent event bubbling
      onShowDetails(item);
   };

   if (type === "dabba") {
      // This part for dabba menu remains unchanged
      return (
         <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
            {/* ... Dabba card JSX is unchanged ... */}
            <div className="flex flex-col md:flex-row">
               <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-3">
                     <h4 className="font-bold text-xl text-gray-800 group-hover:text-green-700 transition-colors">
                        {item.name}
                     </h4>
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{item.rating}</span>
                     </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                     {item.desc}
                  </p>

                  <div className="flex flex-col md:flex-row items-center justify-between">
                     <div className="flex items-center p-2 rounded-lg gap-4 bg-green-100">
                        <span className="text-2xl font-bold text-green-700">
                           ₹{item.price}
                        </span>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                           <span className="flex items-center gap-1">
                              <Utensils className="w-4 h-4" />
                              {item.servings}
                           </span>
                           <SpicyIndicator level={item.spiceLevel} />
                        </div>
                     </div>

                     <button
                        onClick={handleAdd}
                        disabled={isAdding}
                        className={`flex items-center gap-2 px-6 mt-4 py-3 rounded-full font-medium transition-all duration-300 ${
                           isAdding
                              ? "bg-green-500 text-white scale-95"
                              : "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
                        }`}
                     >
                        {isAdding ? (
                           <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Adding...
                           </>
                        ) : (
                           <>
                              <Plus className="w-4 h-4" />
                              Add
                           </>
                        )}
                     </button>
                  </div>
               </div>

               <div className="md:w-1/3 relative">
                  <img
                     src={getCafeImage(item, Math.floor(Math.random() * 4))}
                     alt={item.name}
                     className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                     onClick={handleImageClick}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                     {item.servings} servings
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // UPDATED FOR CAFE MENU - uses data from backend
   return (
      <div className="min-w-[280px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
         <div className="relative">
            <img
               src={item.image}
               alt={item.name}
               className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
               onClick={handleImageClick}
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-sm">
               <Star className="w-3 h-3 text-yellow-500 fill-current" />
               <span className="font-medium text-gray-700">{item.rating}</span>
            </div>
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center gap-1">
               <Clock className="w-3 h-3" />
               {/* Using preparationTime from backend */}
               {item.preparationTime} min
            </div>
         </div>

         <div className="p-5">
            <div className="flex items-start justify-between mb-3">
               <h4 className="font-semibold text-lg text-gray-800 group-hover:text-green-700 transition-colors">
                  {item.name}
               </h4>
               {/* Using spiceLevel from backend */}
               <SpicyIndicator level={item.spiceLevel} />
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-green-700">
                     ₹{item.price}
                  </span>
                  <button
                     onClick={handleViewMore}
                     className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                     <Eye className="w-3 h-3" />
                     View More
                  </button>
               </div>
               <button
                  onClick={handleAdd}
                  disabled={isAdding}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                     isAdding
                        ? "bg-green-500 text-white scale-95"
                        : "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
                  }`}
               >
                  {isAdding ? (
                     <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                     </>
                  ) : (
                     <>
                        <Plus className="w-4 h-4" />
                        Add
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
}

export default function EnhancedMenuSystem() {
   const [activeMenu, setActiveMenu] = useState("cafe");
   const [selectedItem, setSelectedItem] = useState(null);
   const router = useNavigate();

   // State for holding fetched cafe menu data
   const [cafeMenu, setCafeMenu] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const dispatch = useDispatch();
   const { items } = useSelector((state) => state.cart);

   useEffect(() => {
      const fetchCafeMenu = async () => {
         try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/menu`);
            console.log("MENU RESPONSE:", response?.data);

            const items = response?.data?.data;
            console.log("ITEMS FROM RESPONSE:", items);

            // Process the flat array from the backend into grouped sections
            const groupedMenu = items.reduce((acc, item) => {
               // Find if a section for this items category already exists
               let section = acc.find((sec) => sec.section === item.category);

               // If not, create a new section
               if (!section) {
                  section = {
                     section: item.category,
                     icon: <Coffee className="w-5 h-5" />,
                     items: [],
                  };
                  acc.push(section);
               }

               // Add the item to the correct section
               section.items.push(item);

               return acc;
            }, []);

            setCafeMenu(groupedMenu);
            setError(null);
         } catch (err) {
            setError("Could not load the menu. Please try again later.");
            console.error(err);
         } finally {
            setLoading(false);
         }
      };

      fetchCafeMenu();
   }, []); // Empty dependency array means this runs once on component mount

   const addToCart = (item) => {
      dispatch(addItem(item));
      console.log(item, "added item");
   };

   const handleCartClick = () => {
      router("/cart");
   };

   const showItemDetails = (item) => {
      setSelectedItem(item);
   };

   return (
      <section className="bg-gradient-to-br from-gray-50 to-white pt-16 pb-20 px-4">
         <div className="max-w-7xl mx-auto">
            {/* Menu Toggle */}
            <div className="flex justify-center gap-2 mb-12">
               <button
                  onClick={() => setActiveMenu("cafe")}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                     activeMenu === "cafe"
                        ? "bg-green-600 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
               >
                  <Coffee className="w-5 h-5" />
                  Café Menu
               </button>
               <button
                  onClick={() => setActiveMenu("dabba")}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                     activeMenu === "dabba"
                        ? "bg-green-600 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
               >
                  <Utensils className="w-5 h-5" />
                  Dabba Menu
               </button>
            </div>

            {/* Modal for item details */}
            <MenuDetailModal
               item={selectedItem}
               onClose={() => setSelectedItem(null)}
            />

            {/* Cart Indicator */}
            {items.length > 0 && (
               <div
                  className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 cursor-pointer hover:bg-green-700 transition-colors"
                  onClick={handleCartClick}
               >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">{items.length} items</span>
               </div>
            )}

            {/* Menu Content */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
               {activeMenu === "cafe" ? (
                  <div className="space-y-16">
                     {loading && (
                        <p className="text-center">
                           Loading our delicious menu...
                        </p>
                     )}
                     {error && (
                        <p className="text-center text-red-500">{error}</p>
                     )}
                     {!loading &&
                        !error &&
                        cafeMenu.map((group, idx) => (
                           <div key={idx} className="group">
                              <div className="flex items-center gap-3 mb-8">
                                 <div className="p-3 bg-green-100 rounded-xl text-green-700">
                                    {group.icon}
                                 </div>
                                 <h3 className="text-3xl font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                                    {group.section}
                                 </h3>
                              </div>
                              <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                                 {group.items.map((item, i) => (
                                    <MenuCard
                                       key={item._id || i}
                                       item={{
                                          ...item,
                                          image: getCafeImage(item, i),
                                       }}
                                       onAdd={addToCart}
                                       onShowDetails={showItemDetails}
                                    />
                                 ))}
                              </div>
                           </div>
                        ))}
                  </div>
               ) : (
                  <div className="space-y-8">
                     {/* Dabba menu rendering */}
                     {dabbaMenu.map((section, i) => (
                        <div
                           key={i}
                           className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg"
                        >
                           <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                              <h3 className="text-2xl font-bold text-green-800 flex items-center gap-3">
                                 <Utensils className="w-6 h-6" />
                                 {section.title}
                              </h3>
                           </div>
                           <div className="p-6 space-y-6">
                              {section.items.map((item, j) => (
                                 <MenuCard
                                    key={j}
                                    item={item}
                                    onAdd={addToCart}
                                    onShowDetails={showItemDetails}
                                    type="dabba"
                                 />
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </section>
   );
}
