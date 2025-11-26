"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Button from "@/components/Button";

export default function HomePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if there's a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          // No valid session - redirect to landing page
          router.replace("/");
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          // Invalid user - redirect to landing page
          router.replace("/");
          return;
        }

        // User is authenticated, allow access
        setIsCheckingAuth(false);
      } catch (err) {
        console.error("Auth check error:", err);
        // On any unexpected error, redirect to landing page for safety
        router.replace("/");
      }
    };

    checkAuthentication();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear session storage
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
      }
      
      // Redirect to landing page
      router.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
      // Still redirect even if there's an error
      router.replace("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-graytext">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-black">Hello World</h1>
        <Button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={isLoggingOut ? "opacity-70" : ""}
        >
          {isLoggingOut ? "Logging out..." : "Log Out"}
        </Button>
      </div>
    </div>
  );
}

