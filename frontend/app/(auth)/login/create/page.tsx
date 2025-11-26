"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MainBackground from "@/components/MainBackground";
import Toast from "@/components/Toast";
import Button from "@/components/Button";
import LoadingIcon from "@/components/LoadingIcon";

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Check authentication on page load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // First check if OTP was just verified (prevents direct URL access)
        const otpVerified = sessionStorage.getItem("otp_verified");
        const otpTimestamp = sessionStorage.getItem("otp_verified_timestamp");
        
        // Check if verification flag exists and is recent (within 5 minutes)
        if (!otpVerified || !otpTimestamp) {
          // No verification flag - redirect to landing page
          router.replace("/");
          return;
        }

        const timestamp = parseInt(otpTimestamp, 10);
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        if (Date.now() - timestamp > fiveMinutes) {
          // Verification flag expired - redirect to landing page
          sessionStorage.removeItem("otp_verified");
          sessionStorage.removeItem("otp_verified_timestamp");
          router.replace("/");
          return;
        }

        // Check if there's a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          // No valid session - redirect to landing page
          router.replace("/");
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user || !user.email) {
          // Invalid user - redirect to landing page
          router.replace("/");
          return;
        }

        // Check if user already exists in database with a name
        const { data: existingUser, error: dbError } = await supabase
          .from("users")
          .select("email, name")
          .eq("email", user.email)
          .maybeSingle(); // Use maybeSingle to handle no rows gracefully

        // If database query failed, don't allow access
        if (dbError) {
          console.error("Database check error:", dbError);
          router.replace("/");
          return;
        }

        // If user exists and has a name, redirect to home (already completed setup)
        if (existingUser && existingUser.name && existingUser.name.trim()) {
          sessionStorage.removeItem("otp_verified");
          sessionStorage.removeItem("otp_verified_timestamp");
          router.replace("/home");
          return;
        }

        // User is authenticated, OTP verified, and doesn't have a name yet - allow access
        setIsCheckingAuth(false);
      } catch (err) {
        console.error("Auth check error:", err);
        // On any unexpected error, redirect to landing page for safety
        router.replace("/");
      }
    };

    checkAuthentication();
  }, [router]);

  useEffect(() => {
    if (error) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name");
      setIsLoading(false);
      return;
    }

    try {
      // Get the access token for API authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const token = session.access_token;

      // Call backend API to create user
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/auth/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to create account. Please try again.");
      }

      // Clear OTP verification flag
      sessionStorage.removeItem("otp_verified");
      sessionStorage.removeItem("otp_verified_timestamp");

      // Redirect to home page after successful setup
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Failed to set up your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isNameEmpty = !name.trim();

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <MainBackground className="flex min-h-screen items-center justify-center px-6 py-12">
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
          <div className="text-center">
            <LoadingIcon />
          </div>
        </div>
      </MainBackground>
    );
  }

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

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-black">How should we call you?</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-black">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-graytext px-4 py-3 text-[16px] text-black font-medium placeholder:text-graytext focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <Button 
              type="submit" 
              className={isLoading || isNameEmpty ? "bg-disabled" : ""} 
              disabled={isLoading || isNameEmpty}
            >
              {isLoading ? "Setting up..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </MainBackground>
  );
}

