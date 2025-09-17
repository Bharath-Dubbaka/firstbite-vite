"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function TestimonialsSection() {
   return (
      <div className="relative py-24 bg-gradient-to-br from-orange-50 to-red-50 ">
         <h2 className="text-center text-3xl md:text-4xl font-bold text-red-600 mb-12">
            ❤️ What Our Customers Say
         </h2>
         <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="px-4"
         />
      </div>
   );
}

const testimonials = [
   {
      quote: "The café is my go-to spot for work and snacks. The food is comforting and the vibe is unmatched.",
      name: "Divya M",
      title: "Café Regular",
   },
   {
      quote: "I signed up for the tiffin service and I’m so glad I did! Tastes like home.",
      name: "Ankith R",
      title: "Dabba Subscriber",
   },
   {
      quote: "Affordable, hygienic, and always fresh. Highly recommended!",
      name: "Priya M",
      title: "Happy Customer",
   },
   {
      quote: "The lunchbox delivery always feels like a warm hug. I can’t imagine my workdays without it.",
      name: "Meghana T",
      title: "Corporate Client",
   },
   {
      quote: "Café ambiance + great food = perfect combo. Ideal for meetups and remote work.",
      name: "Rohit V",
      title: "Cafe Enthusiast",
   },
];

export const InfiniteMovingCards = ({
   items,
   direction = "left",
   speed = "fast",
   pauseOnHover = true,
   className,
}) => {
   const containerRef = React.useRef(null);
   const scrollerRef = React.useRef(null);

   useEffect(() => {
      addAnimation();
   }, []);
   const [start, setStart] = useState(false);
   function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
         const scrollerContent = Array.from(scrollerRef.current.children);

         scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            if (scrollerRef.current) {
               scrollerRef.current.appendChild(duplicatedItem);
            }
         });

         getDirection();
         getSpeed();
         setStart(true);
      }
   }
   const getDirection = () => {
      if (containerRef.current) {
         if (direction === "left") {
            containerRef.current.style.setProperty(
               "--animation-direction",
               "forwards"
            );
         } else {
            containerRef.current.style.setProperty(
               "--animation-direction",
               "reverse"
            );
         }
      }
   };
   const getSpeed = () => {
      if (containerRef.current) {
         if (speed === "fast") {
            containerRef.current.style.setProperty(
               "--animation-duration",
               "20s"
            );
         } else if (speed === "normal") {
            containerRef.current.style.setProperty(
               "--animation-duration",
               "40s"
            );
         } else {
            containerRef.current.style.setProperty(
               "--animation-duration",
               "80s"
            );
         }
      }
   };
   return (
      <div
         ref={containerRef}
         className={cn(
            "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_30%,white_70%,transparent)]",
            className
         )}
      >
         <ul
            ref={scrollerRef}
            className={cn(
               "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
               start && "animate-scroll",
               pauseOnHover && "hover:[animation-play-state:paused]"
            )}
         >
            {items.map((item, idx) => (
               <li
                  className="relative w-[320px] md:w-[420px] max-w-full shrink-0 rounded-2xl border border-orange-100 bg-white shadow-xl px-6 py-6 transition-transform duration-300 hover:scale-105"
                  key={item.name}
               >
                  <blockquote>
                     <span className="relative z-20 text-base leading-relaxed font-medium text-gray-800">
                        “{item.quote}”
                     </span>
                     <div className="relative z-20 mt-4 flex flex-col">
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                           {item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                           {item.title}
                        </span>
                     </div>
                  </blockquote>
               </li>
            ))}
         </ul>
      </div>
   );
};
