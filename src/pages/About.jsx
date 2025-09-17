
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

// Main Features Section Component
export default function About() {
   const features = [
      {
         title: "Fresh Daily Meals",
         description:
            "Home-cooked meals prepared fresh daily with love and care, just like maa ke haath ka khana.",
         skeleton: <SkeletonOne />,
         className:
            "col-span-1 lg:col-span-4 border-b lg:border-r border-orange-200",
      },
      {
         title: "Hygienic Kitchen",
         description:
            "State-of-the-art kitchen with highest hygiene standards and fresh ingredients.",
         skeleton: <SkeletonTwo />,
         className: "border-b col-span-1 lg:col-span-2 border-orange-200",
      },
      {
         title: "Flexible Plans",
         description:
            "Choose from daily, weekly, or monthly subscription plans that fit your lifestyle.",
         skeleton: <SkeletonThree />,
         className: "col-span-1 lg:col-span-3 lg:border-r border-orange-200",
      },
      {
         title: "Timely Delivery",
         description:
            "Always on time delivery to your doorstep with our efficient logistics network.",
         skeleton: <SkeletonFour />,
         className: "col-span-1 lg:col-span-3 border-b lg:border-none",
      },
   ];

   return (
      <div className="relative z-20 py-40 max-w-7xl mx-auto bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-hidden">
         <div className="absolute inset-0 overflow-hidden">
            {/* Floating Spice Particles */}
            <div className="absolute top-20 left-10 w-3 h-3 bg-orange-400 rounded-full animate-bounce opacity-70"></div>
            <div className="absolute top-32 right-20 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-60"></div>
            <div className="absolute bottom-40 left-16 w-4 h-4 bg-yellow-500 rounded-full animate-pulse opacity-80"></div>

            {/* Gradient Orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-25 animate-pulse delay-1000"></div>
         </div>
         <div className="px-8">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="text-center mb-16"
            >
               <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                  About Love at First Byte
               </h2>
               <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  We believe food should be both comforting and convenient.
                  Offering flavorful café experiences and wholesome tiffin
                  services for busy professionals, students, and families.
               </p>
               <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                     <Heart className="w-5 h-5 text-red-500" />
                     <span className="text-sm font-medium">
                        Fresh Ingredients
                     </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                     <Shield className="w-5 h-5 text-green-500" />
                     <span className="text-sm font-medium">
                        Hygienic Kitchen
                     </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                     <Calendar className="w-5 h-5 text-blue-500" />
                     <span className="text-sm font-medium">Flexible Plans</span>
                  </div>
               </div>
            </motion.div>
         </div>

         <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-2xl border-orange-200 bg-white shadow-xl overflow-hidden">
               {features.map((feature, index) => (
                  <FeatureCard
                     key={feature.title}
                     className={feature.className}
                     index={index}
                  >
                     <FeatureTitle>{feature.title}</FeatureTitle>
                     <FeatureDescription>
                        {feature.description}
                     </FeatureDescription>
                     <div className="h-full w-full">{feature.skeleton}</div>
                  </FeatureCard>
               ))}
            </div>
         </div>
      </div>
   );
}

const FeatureCard = ({ children, className, index }) => {
   return (
      <motion.div
         className={cn(`p-6 sm:p-8 relative overflow-hidden`, className)}
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: index * 0.1 }}
      >
         {children}
      </motion.div>
   );
};

const FeatureTitle = ({ children }) => {
   return (
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
         {children}
      </h3>
   );
};

const FeatureDescription = ({ children }) => {
   return (
      <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
         {children}
      </p>
   );
};

// Skeleton Components
export const SkeletonOne = () => {
   return (
      <div className="relative flex py-4 gap-4 h-full">
         <div className="w-full p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl shadow-lg">
            <div className="flex flex-col space-y-3">
               <div className="w-full h-32 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-orange-600" />
               </div>
               <div className="space-y-2">
                  <div className="h-3 bg-orange-200 rounded w-3/4"></div>
                  <div className="h-3 bg-orange-200 rounded w-1/2"></div>
               </div>
            </div>
         </div>
      </div>
   );
};

export const SkeletonTwo = () => {
   const icons = [Shield, Heart, Star, CheckCircle];

   return (
      <div className="relative flex flex-col items-center p-4 gap-4 h-full">
         <div className="grid grid-cols-2 gap-4 w-full">
            {icons.map((Icon, idx) => (
               <motion.div
                  key={idx}
                  className="bg-gradient-to-br from-green-100 to-blue-100 p-4 rounded-xl shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
               >
                  <Icon className="w-8 h-8 text-green-600 mx-auto" />
               </motion.div>
            ))}
         </div>
      </div>
   );
};

export const SkeletonThree = () => {
   return (
      <div className="relative flex flex-col items-center p-4 h-full">
         <div className="w-full max-w-sm">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl shadow-lg">
               <div className="text-center">
                  <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <div className="space-y-2">
                     <div className="h-3 bg-purple-200 rounded w-full"></div>
                     <div className="h-3 bg-purple-200 rounded w-2/3 mx-auto"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export const SkeletonFour = () => {
   return (
      <div className="relative flex flex-col items-center p-4 h-full">
         <div className="w-full max-w-sm">
            <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-lg">
               <div className="text-center">
                  <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="flex justify-center gap-2">
                     <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                     <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                     <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
