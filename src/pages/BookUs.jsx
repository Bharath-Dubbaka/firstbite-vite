import { useState, useEffect, useRef } from "react"; // Added useRef
import { motion, AnimatePresence } from "framer-motion";
import {
   Heart,
   Clock,
   Shield,
   Truck,
   Users,
   ChefHat,
   Calendar,
   MapPin,
   Phone,
   Star,
   CheckCircle,
   Gift,
   Cake,
   Coffee,
   UtensilsCrossed,
   ArrowRight,
   MessageCircle,
} from "lucide-react";
import Input from "../components/ui/Input";

// Tabs Component for Services
export default function Bookus() {
   const [activeTab, setActiveTab] = useState("kitty");

   const tabs = [
      {
         title: "Kitty Party",
         value: "kitty",
         content: (
            <div className="w-full overflow-hidden relative h-full rounded-2xl p-8 bg-gradient-to-br from-pink-500 to-purple-500">
               <div className="text-white">
                  <div className="flex items-center gap-3 mb-6">
                     <Gift className="w-8 h-8" />
                     <h3 className="text-2xl md:text-3xl font-bold">
                        Kitty Party Bookings
                     </h3>
                  </div>
                  <p className="text-lg mb-6 opacity-90">
                     Host the perfect kitty party with our chic, cozy space and
                     personalized service.
                  </p>
                  <div className="space-y-3">
                     <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Reserved private seating (Indoor/Outdoor)</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Customized menu & decoration options</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Groups of 6-20 people</span>
                     </div>
                  </div>
               </div>
            </div>
         ),
      },
      {
         title: "Catering",
         value: "catering",
         content: (
            <div className="w-full overflow-hidden relative h-full rounded-2xl p-8 bg-gradient-to-br from-blue-500 to-teal-500">
               <div className="text-white">
                  <div className="flex items-center gap-3 mb-6">
                     <Users className="w-8 h-8" />
                     <h3 className="text-2xl md:text-3xl font-bold">
                        Catering Services
                     </h3>
                  </div>
                  <p className="text-lg mb-6 opacity-90">
                     Delicious food for every occasion - from intimate
                     gatherings to large celebrations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <h4 className="font-semibold mb-2">Events We Cater:</h4>
                        <ul className="text-sm space-y-1 opacity-90">
                           <li>• House Parties</li>
                           <li>• Office Lunches</li>
                           <li>• Birthday Celebrations</li>
                           <li>• Community Events</li>
                        </ul>
                     </div>
                     <div>
                        <h4 className="font-semibold mb-2">Menu Options:</h4>
                        <ul className="text-sm space-y-1 opacity-90">
                           <li>• Multi-cuisine options</li>
                           <li>• Veg/Non-Veg choices</li>
                           <li>• Buffet or individual packaging</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         ),
      },
      {
         title: "Cloud Bakery",
         value: "bakery",
         content: (
            <div className="w-full overflow-hidden relative h-full rounded-2xl p-8 bg-gradient-to-br from-yellow-500 to-orange-500">
               <div className="text-white">
                  <div className="flex items-center gap-3 mb-6">
                     <Cake className="w-8 h-8" />
                     <h3 className="text-2xl md:text-3xl font-bold">
                        Cloud Bakery
                     </h3>
                  </div>
                  <p className="text-lg mb-6 opacity-90">
                     Freshly baked, lovingly made, and delivered to your
                     doorstep. Online orders only.
                  </p>
                  <div className="space-y-4">
                     <div>
                        <h4 className="font-semibold mb-2">
                           Our Signature Bakes:
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm opacity-90">
                           <div>• Customized Theme Cakes</div>
                           <div>• Jar Cakes & Cupcakes</div>
                           <div>• Brownies & Cookies</div>
                           <div>• Eggless & Vegan Options</div>
                        </div>
                     </div>
                     <div className="bg-white bg-opacity-20 rounded-xl p-4">
                        <p className="text-sm">
                           <strong>Free delivery</strong> on pre-orders in
                           Nallagandla
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         ),
      },
      // {
      //    title: "Dabba Service",
      //    value: "dabba",
      //    content: (
      //       <div className="w-full overflow-hidden relative h-full rounded-2xl p-8 bg-gradient-to-br from-orange-500 to-red-500">
      //          <div className="text-white">
      //             <div className="flex items-center gap-3 mb-6">
      //                <UtensilsCrossed className="w-8 h-8" />
      //                <h3 className="text-2xl md:text-3xl font-bold">
      //                   Daily Dabba Service
      //                </h3>
      //             </div>
      //             <p className="text-lg mb-6 opacity-90">
      //                Fresh home-cooked meals delivered daily with flexible
      //                subscription plans.
      //             </p>
      //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      //                <div className="bg-white bg-opacity-20 rounded-xl p-4">
      //                   <h4 className="font-semibold mb-2">Daily Plans</h4>
      //                   <p className="text-sm opacity-80">
      //                      Fresh meals every day
      //                   </p>
      //                </div>
      //                <div className="bg-white bg-opacity-20 rounded-xl p-4">
      //                   <h4 className="font-semibold mb-2">Weekly Plans</h4>
      //                   <p className="text-sm opacity-80">
      //                      Flexible weekly options
      //                   </p>
      //                </div>
      //             </div>
      //          </div>
      //       </div>
      //    ),
      // },
   ];

   return (
      <div className="max-w-7xl mx-auto py-40 px-4">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
         >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
               Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               From daily meals to special occasions, we have got you covered
               with our comprehensive food services
            </p>
         </motion.div>

         {/* Contact section */}
         <section className="min-h-screen bg-[#070b12] flex items-center justify-center py-8 md:py-auto px-6 mb-6">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
               {/* LEFT SIDE */}
               <div className="text-white">
                  <h2 className="text-4xl md:text-5xl font-elegant leading-tight mb-10">
                     BOOKING <br />
                     <span className="text-[#d4af37]">A TABLE</span>
                  </h2>

                  <form className="space-y-6">
                     <Input placeholder="Name*" />
                     <Input placeholder="Email*" type="email" />
                     <Input placeholder="Phone Number*" />

                     <select className="form-input">
                        <option>08:00 pm</option>
                        <option>09:00 pm</option>
                        <option>10:00 pm</option>
                     </select>

                     <select className="form-input">
                        <option>2 Persons</option>
                        <option>4 Persons</option>
                        <option>6 Persons</option>
                     </select>

                     <Input type="date" />

                     <button
                        type="submit"
                        className="w-full bg-[#e3b23c] text-black py-3 rounded-full font-semibold tracking-wide hover:bg-[#cfa12f] transition"
                     >
                        Book Table
                     </button>
                  </form>
               </div>

               {/* RIGHT SIDE IMAGE */}
               <div className="hidden md:block">
                  <img
                     src="/lafb_sign.webp"
                     alt="Restaurant Interiors"
                     className="rounded-lg w-full h-[520px] object-cover"
                  />
               </div>
            </div>
         </section>

         <div className="relative">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
               {tabs.map((tab) => (
                  <button
                     key={tab.value}
                     onClick={() => setActiveTab(tab.value)}
                     className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        activeTab === tab.value
                           ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                           : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                     }`}
                  >
                     {tab.title}
                  </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="relative h-96 md:h-80">
               <AnimatePresence mode="wait">
                  {tabs.map(
                     (tab) =>
                        tab.value === activeTab && (
                           <motion.div
                              key={tab.value}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0"
                           >
                              {tab.content}
                           </motion.div>
                        ),
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
   );
}
