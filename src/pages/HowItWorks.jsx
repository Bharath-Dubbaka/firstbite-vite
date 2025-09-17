
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

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Timeline Component for How It Works
export default function Howitworks() {
   const steps = [
      {
         title: "Choose a Plan",
         description:
            "Pick from our flexible dabba service options tailored for your needs.",
         icon: <UtensilsCrossed className="w-6 h-6" />,
         color: "from-orange-500 to-red-500",
      },
      {
         title: "Place Your Order",
         description:
            "Order online through our website or simply message us on WhatsApp.",
         icon: <Phone className="w-6 h-6" />,
         color: "from-green-500 to-teal-500",
      },
      {
         title: "Freshly Cooked Meals",
         description:
            "Our chefs prepare your meals fresh daily in our hygienic kitchen.",
         icon: <ChefHat className="w-6 h-6" />,
         color: "from-blue-500 to-purple-500",
      },
      {
         title: "Timely Delivery",
         description:
            "Get your delicious dabba delivered right to your doorstep on time.",
         icon: <Truck className="w-6 h-6" />,
         color: "from-purple-500 to-pink-500",
      },
   ];

   return (
      <div className=" w-full md:max-w-6xl md:mx-auto my-32 py-10 px-4 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-hidden">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
         >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
               How Subscription Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               Simple steps to get your favorite meals delivered fresh and on
               time
            </p>
         </motion.div>

         <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-200 to-red-200 hidden lg:block"></div>

            {steps.map((step, index) => (
               <motion.div
                  key={index}
                  className={`relative flex items-center mb-12 ${
                     index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
               >
                  {/* Content */}
                  <div
                     className={`flex-1 ${
                        index % 2 === 0 ? "lg:pr-8" : "lg:pl-8"
                     }`}
                  >
                     <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div
                           className={`inline-flex items-center gap-3 bg-gradient-to-r ${step.color} text-white px-4 py-2 rounded-full mb-4`}
                        >
                           {step.icon}
                           <span className="font-semibold">
                              Step {index + 1}
                           </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                           {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                           {step.description}
                        </p>
                     </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>
               </motion.div>
            ))}
         </div>

         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
         >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
               <div className="flex items-center justify-center gap-4 mb-6">
                  <Users className="w-8 h-8" />
                  <span className="text-xl font-semibold">
                     Ideal for Students | Professionals | Families
                  </span>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                     Try a Trial Meal
                  </button>
                  <button className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
                     <MessageCircle className="w-4 h-4" />
                     Contact Us on WhatsApp
                  </button>
               </div>
            </div>
         </motion.div>
      </div>
   );
}
