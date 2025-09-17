// src/components/PhoneAuth.jsx

import React, { useEffect, useState } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../services/firebase";
import { initRecaptcha } from "../lib/initRecaptcha";

const PhoneAuth = () => {
   const [phoneNumber, setPhoneNumber] = useState("");
   const [otp, setOtp] = useState("");
   const [otpSent, setOtpSent] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   // ✅ Init reCAPTCHA when component mounts
   useEffect(() => {
      setTimeout(() => {
         const container = document.getElementById("recaptcha-container");
         if (container) {
            console.log("📦 recaptcha-container found, initializing...");
            initRecaptcha();
         } else {
            console.warn("⚠️ recaptcha-container not found!");
         }
      }, 100);
   }, []);

   const handleSendOTP = async () => {
      console.dir({
         recaptchaVerifier: window.recaptchaVerifier,
         grecaptcha: window.grecaptcha,
         recaptchaWidgetId: window.recaptchaWidgetId,
      });
      try {
         setError("");
         setLoading(true);

         const appVerifier = window.recaptchaVerifier;
         if (!appVerifier) {
            throw new Error("reCAPTCHA not ready");
         }

         await appVerifier.verify();

         const confirmation = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            appVerifier
         );
         window.confirmationResult = confirmation;

         setOtpSent(true);
         alert("OTP sent successfully!");
      } catch (err) {
         console.error("❌ OTP send error:", err);
         alert("Failed to send OTP: " + err.message);
      } finally {
         setLoading(false);
      }
   };

   const handleVerifyOTP = async () => {
      try {
         setLoading(true);
         const result = await window.confirmationResult.confirm(otp);
         const user = result.user;
         console.log("✅ OTP verified, user:", user);
         alert("Login successful");
      } catch (err) {
         console.error("❌ OTP verify error:", err);
         alert("Invalid OTP: " + err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div>
         {/* ✅ Required for reCAPTCHA */}
         <div id="recaptcha-container"></div>

         {!otpSent ? (
            <div>
               <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
               />
               <button onClick={handleSendOTP} disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
               </button>
            </div>
         ) : (
            <div>
               <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
               />
               <button onClick={handleVerifyOTP} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
               </button>
            </div>
         )}

         {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
   );
};

export default PhoneAuth;
