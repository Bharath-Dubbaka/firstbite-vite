"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
   Menu,
   X,
   Heart,
   Phone,
   Mail,
   MapPin,
   Clock,
   Instagram,
   Facebook,
   Twitter,
   MessageCircle,
   ChevronUp,
   Coffee,
   UtensilsCrossedIcon,
   Users,
   Shield,
   Truck,
   Star,
} from "lucide-react";

// Comprehensive Footer Component
export default function Footer() {
   const [email, setEmail] = useState("");
   const [showBackToTop, setShowBackToTop] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         setShowBackToTop(window.scrollY > 300);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   const quickLinks = [
      { href: "/", label: "Home" },
      { href: "/cafe-menu", label: "Café Menu" },
      { href: "/dabba-plans", label: "Dabba Plans" },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
   ];

   const services = [
      {
         icon: <Coffee className="w-5 h-5" />,
         name: "Café Service",
         desc: "Fresh coffee & snacks",
      },
      {
         icon: <UtensilsCrossedIcon className="w-5 h-5" />,
         name: "Dabba Service",
         desc: "Daily meal plans",
      },
      {
         icon: <Users className="w-5 h-5" />,
         name: "Catering",
         desc: "Event catering",
      },
      {
         icon: <Coffee className="w-5 h-5" />,
         name: "Cloud Bakery",
         desc: "Fresh baked goods",
      },
   ];

   const handleNewsletterSubmit = () => {
      // Handle newsletter signup
      console.log("Newsletter signup:", email);
      setEmail("");
   };

   return (
      <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
         </div>

         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {/* Brand Section */}
               <div className="lg:col-span-1">
                  <motion.div
                     className="flex items-center space-x-2 mb-6"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                  >
                     <div className="text-3xl">💝</div>
                     <div className="text-xl font-bold">
                        <span className="text-red-400">Love</span>
                        <span className="text-green-400">@firstbite</span>
                     </div>
                  </motion.div>

                  <motion.p
                     className="text-gray-300 mb-6 leading-relaxed"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.1 }}
                  >
                     Serving fresh, home-cooked meals with love. From café
                     delights to daily dabba service, we bring comfort food to
                     your doorstep.
                  </motion.p>

                  <motion.div
                     className="flex space-x-4"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.2 }}
                  >
                     <a
                        href="#"
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-110"
                     >
                        <Facebook className="w-5 h-5" />
                     </a>
                     <a
                        href="#"
                        className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-110"
                     >
                        <Instagram className="w-5 h-5" />
                     </a>
                     <a
                        href="#"
                        className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-110"
                     >
                        <Twitter className="w-5 h-5" />
                     </a>
                     <a
                        href="#"
                        className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-110"
                     >
                        <MessageCircle className="w-5 h-5" />
                     </a>
                  </motion.div>
               </div>

               {/* Quick Links */}
               <div className="lg:col-span-1">
                  <motion.h3
                     className="text-xl font-bold mb-6 text-white"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                  >
                     Quick Links
                  </motion.h3>
                  <motion.ul
                     className="space-y-3"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.1 }}
                  >
                     {quickLinks.map((link, index) => (
                        <li key={link.href}>
                           <Link
                              href={link.href}
                              className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                           >
                              <span className="w-1.5 h-1.5 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                              <span>{link.label}</span>
                           </Link>
                        </li>
                     ))}
                  </motion.ul>
               </div>

               {/* Our Services */}
               <div className="lg:col-span-1">
                  <motion.h3
                     className="text-xl font-bold mb-6 text-white"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                  >
                     Our Services
                  </motion.h3>
                  <motion.div
                     className="space-y-4"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.1 }}
                  >
                     {services.map((service, index) => (
                        <div
                           key={index}
                           className="flex items-start space-x-3 group cursor-pointer"
                        >
                           <div className="text-red-400 mt-1 group-hover:text-red-300 transition-colors duration-200">
                              {service.icon}
                           </div>
                           <div>
                              <h4 className="font-medium text-white group-hover:text-red-400 transition-colors duration-200">
                                 {service.name}
                              </h4>
                              <p className="text-sm text-gray-400">
                                 {service.desc}
                              </p>
                           </div>
                        </div>
                     ))}
                  </motion.div>
               </div>

               {/* Contact & Newsletter */}
               <div className="lg:col-span-1">
                  <motion.h3
                     className="text-xl font-bold mb-6 text-white"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                  >
                     Contact Us
                  </motion.h3>

                  <motion.div
                     className="space-y-4 mb-6"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.1 }}
                  >
                     <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-red-400" />
                        <span className="text-gray-300">
                           Nallagandla, Hyderabad
                        </span>
                     </div>
                     <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-red-400" />
                        <span className="text-gray-300">+91 98765 43210</span>
                     </div>
                     <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-red-400" />
                        <span className="text-gray-300">
                           hello@loveatfirstbyte.com
                        </span>
                     </div>
                     <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-red-400" />
                        <span className="text-gray-300">Mon-Sun: 8AM-10PM</span>
                     </div>
                  </motion.div>

                  {/* Newsletter Signup */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.2 }}
                  >
                     <h4 className="font-semibold mb-3 text-white">
                        Stay Updated
                     </h4>
                     <div className="flex flex-col space-y-2">
                        <input
                           type="email"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors duration-200"
                        />
                        <button
                           onClick={handleNewsletterSubmit}
                           className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
                        >
                           Subscribe
                        </button>
                     </div>
                  </motion.div>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 py-6">
               <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <motion.div
                     className="text-gray-400 text-sm"
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ duration: 0.6 }}
                  >
                     © 2024 Love at First Byte. All rights reserved.
                  </motion.div>

                  <motion.div
                     className="flex space-x-6 text-sm"
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ duration: 0.6, delay: 0.1 }}
                  >
                     <Link
                        href="/privacy"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                     >
                        Privacy Policy
                     </Link>
                     <span className="text-gray-600">|</span>
                     <Link
                        href="/terms"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                     >
                        Terms
                     </Link>
                  </motion.div>

                  <motion.div
                     className="flex items-center space-x-2 text-gray-400"
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     transition={{ duration: 0.6, delay: 0.2 }}
                  >
                     <span className="text-sm">Made with</span>
                     <Heart className="w-4 h-4 text-red-400 fill-current" />
                     <span className="text-sm">in India</span>
                  </motion.div>
               </div>
            </div>
         </div>

         {/* Back to Top Button */}
         <AnimatePresence>
            {showBackToTop && (
               <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={scrollToTop}
                  className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-110 z-40"
               >
                  <ChevronUp className="w-6 h-6" />
               </motion.button>
            )}
         </AnimatePresence>
      </footer>
   );
}
