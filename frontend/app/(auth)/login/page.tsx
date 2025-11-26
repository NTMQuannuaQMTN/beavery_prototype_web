"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MainBackground from "@/components/MainBackground";
import Toast from "@/components/Toast";
import Login from "./components/Login";
import Verify from "./components/Verify";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "otp" | "welcome">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (error) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [error]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Automatically create user if they don't exist
        },
      });

      if (error) throw error;

      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      // Silently handle any errors - don't show toast for resend OTP
      if (error) {
        // Just log the error without showing toast
        console.error("Resend OTP error:", error);
      }
    } catch (err: any) {
      // Silently handle errors - don't show toast for resend OTP
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  const classifyOtpError = (error: any): string => {
    if (!error) return "Invalid OTP. Please try again.";
    
    // Get error message from various possible locations
    const errorMessage = (
      error.message || 
      error.error?.message || 
      error.toString()
    )?.toLowerCase() || "";
    
    const errorCode = (
      error.code || 
      error.error?.code
    )?.toLowerCase() || "";
    
    // Check for wrong OTP errors (covers expired, invalid, or wrong code)
    if (
      errorMessage.includes("invalid token") ||
      errorMessage.includes("invalid otp") ||
      errorMessage.includes("token mismatch") ||
      errorMessage.includes("token has expired") ||
      errorMessage.includes("expired or invalid") ||
      errorMessage.includes("has expired") ||
      errorMessage.includes("or invalid") ||
      errorMessage.includes("invalid") ||
      errorMessage.includes("expired") ||
      errorCode === "token_expired" ||
      errorCode === "invalid_token" ||
      errorCode === "expired_token"
    ) {
      return "Oops, wrong code. Please try again!";
    }
    
    // Return original error message or default fallback
    return error.message || error.error?.message || "Invalid OTP. Please try again.";
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const otpCode = otp.join("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });

      if (error) throw error;

      // Mark that OTP verification was just completed (for create page access)
      sessionStorage.setItem("otp_verified", "true");
      sessionStorage.setItem("otp_verified_timestamp", Date.now().toString());

      // Successfully authenticated - check if user exists in database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email, name")
        .eq("email", email)
        .single();

      // Check if user exists and has a name
      if (userData && userData.name && userData.name.trim()) {
        // User already has a name, go straight to home
        sessionStorage.removeItem("otp_verified");
        sessionStorage.removeItem("otp_verified_timestamp");
        router.push("/home");
      } else {
        // User doesn't exist or doesn't have a name, go to create account page
        router.push("/login/create");
      }
    } catch (err: any) {
      // If it's a database error (user not found), redirect to create page
      if (err.code === "PGRST116") {
        // No rows returned - user doesn't exist
        router.push("/login/create");
      } else if (err.message?.includes("Invalid token") || err.message?.includes("expired")) {
        // OTP verification error
        setError(classifyOtpError(err));
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
      } else {
        // Other errors - show error message
        setError(err.message || "An error occurred. Please try again.");
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainBackground className="flex min-h-screen items-center justify-center px-6 py-12">
      {error && (
        <Toast
          key={error}
          message={error}
          isVisible={showToast}
          onClose={() => {
            setShowToast(false);
            setError(null);
          }}
          duration={2000}
        />
      )}
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/primaryblue.svg"
            alt="Beavery logo"
            width={180}
            height={54}
            priority
          />
        </div>

        {step === "email" ? (
          <Login
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
            error={null}
          />
        ) : step === "otp" ? (
          <Verify
            email={email}
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            onBackToEmail={() => {
              setStep("email");
              setError(null);
              setShowToast(false);
              setOtp(["", "", "", "", "", ""]);
            }}
            onResendOtp={handleResendOtp}
            isLoading={isLoading}
          />
        ) : (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-black">Hey, welcome!</h1>
              <p className="text-graytext">You've successfully signed in.</p>
            </div>
          </div>
        )}
      </div>
    </MainBackground>
  );
}

