// "use client";
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
            {/* <img
               src={getCafeImage(item, Math.floor(Math.random() * 20) + 1)}
               alt={item.name}
               className="w-full h-64 object-cover rounded-md mb-4"
            /> */}
            <h2 className="text-3xl font-bold text-gray-800 italic">
               {item.name}
            </h2>
            <div className="flex items-center my-2 space-x-4">
               <span className="text-2xl font-bold text-amber-700">
                  ₹{item.price}
               </span>
               <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />{" "}
                  {item.rating}
               </div>
            </div>
            <p className="text-gray-600 my-4">{item.description}</p>
         
            {/* Other item details */}
         </div>
      </div>
   );
};

// NEW: Elegant List-Style Menu Item (matching the image style)
// ==============================
// Next.js Elegant list-style item (ported to Vite)
// ==============================
function ElegantMenuItem({ item, onAdd, onShowDetails }) {
   const [isAdding, setIsAdding] = useState(false);

   const handleAdd = (e) => {
      e.stopPropagation();
      setIsAdding(true);
      setTimeout(() => setIsAdding(false), 600);
      onAdd(item);
   };

   return (
      <div
         className="group border-b border-gray-200 py-6 hover:bg-amber-50/30 transition-all duration-300 cursor-pointer"
         onClick={() => onShowDetails(item)}
      >
         <div className="flex justify-between items-start">
            <div className="flex-1">
               <h4 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors">
                  {item.name}
               </h4>

               <p className="text-gray-600 text-sm mb-3 max-w-md leading-relaxed">
                  {item.description || item.desc}
               </p>

               <div className="flex items-center gap-4 text-sm text-gray-500">
                  {item.servings && (
                     <span className="flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5" />
                        {item.servings}
                     </span>
                  )}

                  {item.preparationTime && (
                     <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.preparationTime} min
                     </span>
                  )}

                  {item.spiceLevel > 0 && (
                     <SpicyIndicator level={item.spiceLevel} />
                  )}

                  {item.rating && (
                     <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        {item.rating}
                     </span>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-6 ml-8">
               <span className="text-2xl font-semibold text-gray-800 min-w-[80px] text-right">
                  ₹{item.price}
               </span>
               {/* To Add item in cart */}
               {/* <button
                  onClick={handleAdd}
                  disabled={isAdding}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                     isAdding
                        ? "bg-amber-600 text-white scale-95"
                        : "bg-amber-700 hover:bg-amber-800 text-white hover:scale-105"
                  }`}
               >
                  {isAdding ? (
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                     <>
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add
                     </>
                  )}
               </button> */}
            </div>
         </div>
      </div>
   );
}

// Keep the card version for dabba menu (commented for now, can be used if needed)
/*
function MenuCard({ item, onAdd, onShowDetails, type = "cafe" }) {
  // ... existing MenuCard code ...
}
*/

export default function EnhancedMenuSystem() {
   const [activeMenu, setActiveMenu] = useState("cafe");
   const [selectedItem, setSelectedItem] = useState(null);
   const [activeCategory, setActiveCategory] = useState("ALL MENU");
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
            const response = await axios.get(
               `${import.meta.env.VITE_BACKEND_URL}/api/menu`,
            );
            const items = response.data.data;

            // Process the flat array from the backend into grouped sections
            const groupedMenu = items.reduce((acc, item) => {
               let section = acc.find((sec) => sec.section === item.category);
               if (!section) {
                  section = {
                     section: item.category,
                     icon: <Coffee className="w-5 h-5" />,
                     items: [],
                  };
                  acc.push(section);
               }
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
   }, []);

   const addToCart = (item) => {
      dispatch(addItem(item));
      console.log(item, "added item");
   };

   const handleCartClick = () => {
      navigate("/cart");
   };

   const showItemDetails = (item) => {
      setSelectedItem(item);
   };

   // Get all unique categories for the tab navigation
   const categories = [
      "ALL MENU",
      ...cafeMenu.map((g) => g.section.toUpperCase()),
   ];

   // Filter items based on active category
   const filteredMenu =
      activeCategory === "ALL MENU"
         ? cafeMenu
         : cafeMenu.filter((g) => g.section.toUpperCase() === activeCategory);

   return (
      <section className="bg-gradient-to-br from-stone-50 to-white pt-16 pb-20 px-4">
         <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
               <h2 className="text-5xl font-serif font-bold text-gray-800 mb-3">
                  Special Menu
               </h2>
               <p className="text-gray-600 max-w-md leading-relaxed">
                  Popular Cozy Taberna delights everyone with warm vibes and
                  delicious flavors
               </p>
            </div>

            {/* Category Navigation */}
            <div className="flex gap-8 mb-12 border-b border-gray-200 overflow-x-auto">
               {categories.map((cat) => (
                  <button
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`pb-4 font-medium text-sm tracking-wide transition-all duration-300 relative ${
                        activeCategory === cat
                           ? "text-amber-700"
                           : "text-gray-500 hover:text-gray-700"
                     }`}
                  >
                     {cat}
                     {activeCategory === cat && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700" />
                     )}
                  </button>
               ))}
            </div>

            {/* Modal for item details */}
            <MenuDetailModal
               item={selectedItem}
               onClose={() => setSelectedItem(null)}
            />

            {/* Cart Indicator */}
            {items.length > 0 && (
               <div
                  className="fixed bottom-6 right-6 bg-amber-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 cursor-pointer hover:bg-amber-800 transition-colors"
                  onClick={handleCartClick}
               >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">{items.length} items</span>
               </div>
            )}

            {/* Menu Content */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
               {loading && (
                  <p className="text-center text-gray-500">
                     Loading our delicious menu...
                  </p>
               )}

               {error && <p className="text-center text-red-500">{error}</p>}

               {!loading && !error && (
                  <div className="space-y-12">
                     {filteredMenu.map((group, idx) => (
                        <div key={idx}>
                           {activeCategory === "ALL MENU" && (
                              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-amber-700/20">
                                 {group.section}
                              </h3>
                           )}

                           {/* Two-column layout for menu items */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                              {group.items.map((item, i) => (
                                 <ElegantMenuItem
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
               )}
            </div>

            {/* View All Menu Button */}
            {/* <div className="flex justify-center mt-12">
               <button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-md">
                  View All Menu
               </button>
            </div> */}
         </div>
      </section>
   );
}
