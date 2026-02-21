import React, { useState, useEffect } from "react";
import {
   ChevronDown,
   ChevronLeft,
   ChevronRight,
   Star,
   Sparkles,
} from "lucide-react";

// Inline EncryptedText component with fixes
const EncryptedText = ({
   text,
   className = "",
   revealDelayMs = 50,
   charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[];:,.<>/?",
   flipDelayMs = 50,
   encryptedClassName = "",
   revealedClassName = "",
}) => {
   const [displayText, setDisplayText] = useState("");
   const [revealCount, setRevealCount] = useState(0);

   useEffect(() => {
      const totalLength = text.length;
      let currentReveal = 0;

      const revealInterval = setInterval(() => {
         if (currentReveal < totalLength) {
            currentReveal++;
            setRevealCount(currentReveal);
         } else {
            clearInterval(revealInterval);
         }
      }, revealDelayMs);

      return () => clearInterval(revealInterval);
   }, [text, revealDelayMs]);

   useEffect(() => {
      const scrambleInterval = setInterval(() => {
         const scrambled = text
            .split("")
            .map((char, index) => {
               if (index < revealCount) {
                  return char;
               }
               if (char === " ") return " ";
               return charset[Math.floor(Math.random() * charset.length)];
            })
            .join("");
         setDisplayText(scrambled);
      }, flipDelayMs);

      return () => clearInterval(scrambleInterval);
   }, [text, revealCount, charset, flipDelayMs]);

   return (
      <span className={className}>
         {displayText.split("").map((char, index) => (
            <span
               key={index}
               className={
                  index < revealCount ? revealedClassName : encryptedClassName
               }
            >
               {char}
            </span>
         ))}
      </span>
   );
};

export default function EnhancedHero() {
   const [isVisible, setIsVisible] = useState(false);
   const [currentSlide, setCurrentSlide] = useState(0);
   const [offsetY, setOffsetY] = useState(0);

   const slides = [
      {
         image: "/lafb_shiva.JPG",
         tagline: "Fresh Flavors Delivered Daily",
         subtitle: "From our kitchen to your table",
         accent: "amber",
      },
      {
         image: "/lafb_bg.JPG",
         tagline: "Spices, Meals & Love Combined",
         subtitle: "Every dish tells a story",
         accent: "orange",
      },
      {
         image: "/lafb_sign.webp",

         tagline: "Traditional Taste, Modern Convenience",
         subtitle: "Heritage meets innovation",
         accent: "rose",
      },
   ];

   useEffect(() => {
      const handleScroll = () => setOffsetY(window.scrollY * 0.3);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   useEffect(() => {
      setIsVisible(true);
      const interval = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
   }, []);

   const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
   };

   const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
   };

   return (
      <section className="relative min-h-screen w-full overflow-hidden">
         {/* Carousel Background */}
         {slides.map((slide, index) => (
            <div
               key={index}
               className={`absolute inset-0 bg-cover bg-center will-change-transform transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
               }`}
               style={{
                  backgroundImage: `url('${slide.image}')`,
                  transform: `translateY(${offsetY}px)`,
               }}
            />
         ))}

         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />

         {/* Ambient Light Effect */}
         <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-orange-500/20" />

         {/* Carousel Controls */}
         <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all group"
            aria-label="Previous slide"
         >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
         </button>

         <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all group"
            aria-label="Next slide"
         >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
         </button>

         {/* Slide Indicators */}
         <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
               <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                     index === currentSlide
                        ? "w-8 bg-amber-400"
                        : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
               />
            ))}
         </div>

         {/* Content */}
         <div className="relative z-10 mt-20 flex flex-col items-center justify-center min-h-screen text-center px-6">
            {/* Decorative Element */}
            <div
               className={`absolute top-28 left-1/3 -translate-x-1/2 transition-all duration-1000 ${
                  isVisible ? "opacity-40 scale-100" : "opacity-0 scale-50"
               }`}
            >
               <Sparkles className="w-16 h-16 text-amber-300" />
            </div>

            {/* Brand */}
            <div
               className={`transition-all duration-1000 ${
                  isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-6"
               }`}
            >
               {/* <h3 className="text-6xl md:text-[8rem] font-elegant italic font-light tracking-wide text-white mb-2 drop-shadow-2xl">
                  Crafted with passion, delivered with precision
               </h3> */}

               {/* Encrypted Subtitle */}
               <div className="mb-8">
                  <EncryptedText
                     text="LOVE AT FIRST BYTE"
                     className="text-5xl md:text-[7rem] font-elegant italic font-light tracking-wide text-white mb-2 drop-shadow-2xl"
                     encryptedClassName="text-gray-400"
                     revealedClassName="text-white"
                     revealDelayMs={70}
                     flipDelayMs={80}
                  />
               </div>
            </div>

            {/* Dynamic Tagline with Slide Transition */}
            <div
               className={`transition-all duration-700 ${
                  isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-6"
               }`}
            >
               <p className="max-w-2xl text-2xl md:text-3xl font-light text-white mb-4 leading-relaxed drop-shadow-lg">
                  {slides[currentSlide].tagline}
               </p>
               <p className="text-lg md:text-xl text-amber-200 mb-10 tracking-wide italic">
                  {slides[currentSlide].subtitle}
               </p>
            </div>

            {/* Feature Pills with Animation */}
            <div
               className={`transition-all duration-1000 delay-300 ${
                  isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-6"
               }`}
            >
               <div className="flex flex-wrap justify-center gap-4 mb-14">
                  {[
                     { icon: "🌶️", text: "Authentic Spices" },
                     { icon: "🍛", text: "Fresh Meals" },
                     { icon: "❤️", text: "Made with Love" },
                  ].map((feature, i) => (
                     <span
                        key={i}
                        className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-sm text-white rounded-full hover:bg-white/20 hover:scale-105 transition-all cursor-pointer shadow-lg"
                        style={{ animationDelay: `${i * 100}ms` }}
                     >
                        <span className="mr-2 text-lg">{feature.icon}</span>
                        {feature.text}
                     </span>
                  ))}
               </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div
               className={`transition-all duration-1000 delay-500 ${
                  isVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-6"
               }`}
            >
               {/* <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-full tracking-wide transition-all shadow-2xl hover:shadow-amber-500/50 hover:scale-105">
                     <span className="flex items-center gap-2">
                        Explore Plans
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                     </span>
                  </button>

                  <button className="px-12 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white rounded-full tracking-wide hover:bg-white hover:text-black transition-all flex items-center gap-2 justify-center shadow-lg hover:scale-105">
                     <Star className="w-5 h-5" />
                     View Menu
                  </button>
               </div> */}
            </div>

            {/* Animated Scroll Indicator */}
            <div className="absolute bottom-8 animate-bounce">
               <div className="flex flex-col items-center gap-2">
                  {/* <span className="text-white/70 text-sm tracking-wider">
                     SCROLL
                  </span> */}
                  <ChevronDown className="w-6 h-6 text-white/70" />
               </div>
            </div>
         </div>
      </section>
   );
}
