import React, { useState, useEffect } from "react";
import { ChevronDown, Heart, Sparkles, Star } from "lucide-react";

export default function Hero() {
   const [isVisible, setIsVisible] = useState(false);
   const [currentTagline, setCurrentTagline] = useState(0);

   const taglines = [
      "Fresh Flavors Delivered Daily",
      "Spices, Meals & Love Combined",
      "Traditional Taste, Modern Convenience",
   ];

   useEffect(() => {
      setIsVisible(true);
      const interval = setInterval(() => {
         setCurrentTagline((prev) => (prev + 1) % taglines.length);
      }, 3000);
      return () => clearInterval(interval);
   }, []);

   return (
      <section className="relative min-h-full bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-hidden pt-28 md:pt-0">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden">
            {/* Floating Spice Particles */}
            <div className="absolute top-20 left-10 w-3 h-3 bg-orange-400 rounded-full animate-bounce opacity-70"></div>
            <div className="absolute top-32 right-20 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-60"></div>
            <div className="absolute bottom-40 left-16 w-4 h-4 bg-yellow-500 rounded-full animate-pulse opacity-80"></div>

            {/* Gradient Orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-25 animate-pulse delay-1000"></div>
         </div>

         {/* Main Content */}
         <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
            {/* Logo Animation */}
            <div
               className={`transform transition-all duration-1000 ${
                  isVisible
                     ? "translate-y-0 opacity-100"
                     : "translate-y-10 opacity-0"
               }`}
            >
               <div className="relative mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                     <div className="relative">
                        <Heart
                           className="w-8 h-8 text-red-500 animate-pulse"
                           fill="currentColor"
                        />
                        <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-spin" />
                     </div>
                     <span className="text-2xl">✨</span>
                  </div>

                  <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-green-600 bg-clip-text text-transparent mb-2">
                     @firstbite
                  </h1>

                  <div className="text-2xl md:text-3xl text-gray-700 mb-4">
                     by{" "}
                     <span className="font-semibold text-green-700">
                        Fresh Flavors
                     </span>
                  </div>
               </div>
            </div>

            {/* Animated Tagline */}
            <div
               className={`transform transition-all duration-1000 delay-300 ${
                  isVisible
                     ? "translate-y-0 opacity-100"
                     : "translate-y-10 opacity-0"
               }`}
            >
               <div className="h-16 flex items-center justify-center mb-8">
                  <p className="text-xl md:text-2xl text-gray-700 max-w-2xl px-4 transition-all duration-500">
                     {taglines[currentTagline]}
                  </p>
               </div>
            </div>

            {/* Feature Pills */}
            <div
               className={`transform transition-all duration-1000 delay-500 ${
                  isVisible
                     ? "translate-y-0 opacity-100"
                     : "translate-y-10 opacity-0"
               }`}
            >
               <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {[
                     "🌶️ Authentic Spices",
                     "🍛 Fresh Meals",
                     "❤️ Made with Love",
                  ].map((feature, i) => (
                     <div
                        key={i}
                        className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300"
                     >
                        {feature}
                     </div>
                  ))}
               </div>
            </div>

            {/* CTA Buttons */}
            <div
               className={`transform transition-all duration-1000 delay-700 ${
                  isVisible
                     ? "translate-y-0 opacity-100"
                     : "translate-y-10 opacity-0"
               }`}
            >
               <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                     <span className="relative z-10">Explore Plans</span>
                     <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  <button className="group px-8 py-4 bg-white/90 backdrop-blur-sm text-green-700 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-green-200 hover:bg-white">
                     <span className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        View Menu
                     </span>
                  </button>
               </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
               <ChevronDown className="w-8 h-8 text-green-600 opacity-70" />
            </div>
         </div>

         {/* Bottom Wave */}
         <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
               <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
         </div>
      </section>
   );
}
