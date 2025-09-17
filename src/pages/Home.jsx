
import { useState, useEffect, useRef } from "react"; // Added useRef
import Hero from "../components/Hero";
import Header from "../components/Header";
import EnhancedMenuSystem from "../components/ui/EnhancedMenuSystem";
import Howitworks from "./HowItWorks";
import Testimonials from "../components/ui/TestimonialsSection";

export default function Home() {
   return (
         <div className="bg-gray-900 text-white">
            <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-hidden">
               <Hero />
               <EnhancedMenuSystem />
               <Howitworks />
               <Testimonials />
            </div>
         </div>
   );
}
