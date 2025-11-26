"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if there's a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          // No valid session - redirect to login
          router.replace("/login");
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          // Invalid user - redirect to login
          router.replace("/login");
          return;
        }

        // User is authenticated, allow access
        setIsCheckingAuth(false);
      } catch (err) {
        console.error("Auth check error:", err);
        // On any unexpected error, redirect to login for safety
        router.replace("/login");
      }
    };

    checkAuthentication();
  }, [router]);

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
      <h1 className="text-3xl font-bold text-black">Hello World</h1>
    </div>
  );
}

