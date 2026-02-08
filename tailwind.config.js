/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Updated for Vite
   ],
   theme: {
      extend: {
         fontFamily: {
            signature: ["Dancing Script", "cursive"],
            elegant: ["Playfair Display", "serif"],
            luxury: ["Cormorant Garamond", "serif"],
            cursive: ["Pacifico", "cursive"],
         },
      },
   },
   plugins: [],
};
