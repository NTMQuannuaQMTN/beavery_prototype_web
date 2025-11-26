"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import BotBar from "./botbar";
import IntroSplash from "@/components/IntroSplash";
// import ThemeToggle from "@/components/ThemeToggle";
import MainBackground from "@/components/MainBackground";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

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

        if (userError || !user || !user.email) {
          // Invalid user - redirect to landing page
          router.replace("/");
          return;
        }

        // Fetch user's name from database
        const { data: userData, error: dbError } = await supabase
          .from("users")
          .select("name")
          .eq("email", user.email)
          .maybeSingle();

        if (dbError) {
          console.error("Error fetching user data:", dbError);
        } else if (userData?.name) {
          router.replace('/home');
          return;
        }
      } catch (err) {
        console.error("Auth check error:", err);
        // On any unexpected error, redirect to landing page for safety
        router.replace("/");
      }
    };

    checkAuthentication();
  }, [router]); 

  return (
    <>
      <IntroSplash duration={2000} />
      <MainBackground className="flex min-h-screen items-center justify-center">
        {/* <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div> */}
        <div className="flex flex-col items-center gap-8">
          <Image
            src="/logo/primaryblue.svg"
            alt="Beavery logo"
            width={200}
            height={60}
            priority
          />
          <h1 className="text-4xl font-extrabold" style={{ color: 'var(--title-color)' }}>
            Welcome to Beavery, biyaaatch
          </h1>
          <input
            type="text"
            placeholder="eg. coffee in seoul"
            className="w-full rounded-lg border border-graytext px-4 py-3 text-[16px] font-medium placeholder:text-graytext focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20"
            style={{ color: 'var(--input-text)', caretColor: 'var(--input-text)' }}
          />
          <Link href="/login" className="">
            <Button>Log In</Button>
          </Link>
        </div>
      </MainBackground>
      <BotBar />
    </>
  );
}

