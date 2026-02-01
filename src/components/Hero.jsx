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

   const [offsetY, setOffsetY] = useState(0);

   useEffect(() => {
      const handleScroll = () => setOffsetY(window.scrollY * 0.3);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   useEffect(() => {
      setIsVisible(true);
      const interval = setInterval(() => {
         setCurrentTagline((prev) => (prev + 1) % taglines.length);
      }, 3000);
      return () => clearInterval(interval);
   }, []);

   return (
      <section className="relative min-h-screen w-full overflow-hidden">
         {/* Background Image */}
         <div
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
               backgroundImage: "url('/lafb_pic.jpg')",
               transform: `translateY(${offsetY}px)`,
            }}
         />

         {/* Dark Overlay */}
         <div className="absolute inset-0  bg-black/35" />

         {/* Content */}
         <div className="relative z-10 mt-20 flex flex-col items-center justify-center min-h-screen text-center px-6">
            {/* Brand */}
            <div
               className={`transition-all duration-1000 ${
                  isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-6"
               }`}
            >
               <h1 className="text-5xl md:text-[6rem] shadow-2xl italic font-semibold tracking-wide text-white mb-4">
                  LOVE AT FIRST BYTE
               </h1>

               {/* <p className="text-lg md:text-xl text-amber-300 mb-10 tracking-widest uppercase">
                  by{" "}
                  <span className="text-white font-medium">Fresh Flavors</span>
               </p> */}
            </div>

            {/* Tagline */}
            <div
               className={`transition-all duration-1000 delay-300 ${
                  isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-6"
               }`}
            >
               <p className="max-w-2xl text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
                  {taglines[currentTagline]}
               </p>
            </div>

            {/* Feature Pills */}
            <div
               className={`transition-all duration-1000 delay-500 ${
                  isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-6"
               }`}
            >
               <div className="flex flex-wrap justify-center gap-4 mb-14">
                  {[
                     "🌶️ Authentic Spices",
                     "🍛 Fresh Meals",
                     "❤️ Made with Love",
                  ].map((feature, i) => (
                     <span
                        key={i}
                        className="px-5 py-2 border border-white/30 text-sm text-white rounded-full backdrop-blur-sm"
                     >
                        {feature}
                     </span>
                  ))}
               </div>
            </div>

            {/* CTA */}
            <div
               className={`transition-all duration-1000 delay-700 ${
                  isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-6"
               }`}
            >
               <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full tracking-wide transition">
                     Explore Plans
                  </button>

                  <button className="px-10 py-4 border border-white text-white rounded-full tracking-wide hover:bg-white hover:text-black transition flex items-center gap-2 justify-center">
                     <Star className="w-5 h-5" />
                     View Menu
                  </button>
               </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 animate-bounce">
               <ChevronDown className="w-7 h-7 text-white/70" />
            </div>
         </div>
      </section>
   );
}
