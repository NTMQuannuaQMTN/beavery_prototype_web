"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Button from "@/components/Button";
import LoadingIcon from "@/components/LoadingIcon";
import MainBackground from "@/components/MainBackground";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Hello");

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

        setUserEmail(user.email);

        // Fetch user's name from database
        const { data: userData, error: dbError } = await supabase
          .from("users")
          .select("name")
          .eq("email", user.email)
          .maybeSingle();

        if (dbError) {
          console.error("Error fetching user data:", dbError);
        } else if (userData?.name) {
          setUserName(userData.name);
        }

        // Set time-based greeting
        const hour = new Date().getHours();
        if (hour < 12) {
          setGreeting("Good morning");
        } else if (hour < 18) {
          setGreeting("Good afternoon");
        } else {
          setGreeting("Good evening");
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
      <MainBackground className="flex min-h-screen items-center justify-center">
        <LoadingIcon size="sm" />
      </MainBackground>
    );
  }

  return (
    <MainBackground className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/primaryblue.svg"
            alt="Beavery logo"
            width={120}
            height={36}
            priority
            className="dark:hidden"
          />
          <Image
            src="/logo/primaryblue.svg"
            alt="Beavery logo"
            width={120}
            height={36}
            priority
            className="hidden dark:block"
          />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:bg-[var(--toggle-hover)] disabled:opacity-50"
            style={{ color: 'var(--foreground)' }}
          >
            <ion-icon name="log-out-outline" style={{ fontSize: "18px" }}></ion-icon>
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-12">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="mb-2 text-4xl font-extrabold md:text-5xl" style={{ color: 'var(--title-color)' }}>
              {greeting}, {userName || "there"}! 👋
            </h1>
            <p className="text-lg" style={{ color: 'var(--graytext)' }}>
              {userEmail}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for places, experiences, or anything..."
                className="w-full rounded-xl border border-graytext bg-background px-6 py-4 pl-14 text-[16px] font-medium shadow-sm transition-all placeholder:text-graytext focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20"
                style={{ color: 'var(--input-text)', caretColor: 'var(--caret-color)' }}
              />
              <ion-icon
                name="search-outline"
                className="absolute left-5 top-1/2 -translate-y-1/2"
                style={{ fontSize: "20px", color: 'var(--graytext)' }}
              ></ion-icon>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              icon="location-outline"
              title="Explore"
              description="Discover new places"
              delay="0.2s"
            />
            <QuickActionCard
              icon="heart-outline"
              title="Favorites"
              description="Your saved places"
              delay="0.3s"
            />
            <QuickActionCard
              icon="map-outline"
              title="My Trips"
              description="View your journeys"
              delay="0.4s"
            />
          </div>

          {/* Stats Section */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon="location"
              value="0"
              label="Places Visited"
              delay="0.5s"
            />
            <StatCard
              icon="calendar"
              value="0"
              label="Trips Planned"
              delay="0.6s"
            />
            <StatCard
              icon="star"
              value="0"
              label="Reviews Written"
              delay="0.7s"
            />
          </div>

          {/* Recent Activity */}
          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="rounded-xl border border-graytext/30 bg-background p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold" style={{ color: 'var(--title-color)' }}>
                Recent Activity
              </h2>
              <div className="flex flex-col items-center justify-center py-8">
                <ion-icon
                  name="time-outline"
                  style={{ fontSize: "48px", color: 'var(--graytext)', marginBottom: '12px' }}
                ></ion-icon>
                <p className="text-center" style={{ color: 'var(--graytext)' }}>
                  No recent activity yet. Start exploring to see your journey here!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainBackground>
  );
}

interface QuickActionCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: string;
}

function QuickActionCard({ icon, title, description, delay = "0s" }: QuickActionCardProps) {
  return (
    <button
      className="group relative overflow-hidden rounded-xl border border-graytext/30 bg-background p-6 text-left transition-all hover:border-main hover:shadow-lg hover:shadow-main/10 animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-main/10 transition-all group-hover:bg-main/20">
        <ion-icon
          name={icon}
          style={{ fontSize: "24px", color: 'var(--main)' }}
        ></ion-icon>
      </div>
      <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--title-color)' }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: 'var(--graytext)' }}>
        {description}
      </p>
      <div className="absolute inset-0 bg-gradient-to-br from-main/0 to-main/0 transition-all group-hover:from-main/5 group-hover:to-transparent"></div>
    </button>
  );
}

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  delay?: string;
}

function StatCard({ icon, value, label, delay = "0s" }: StatCardProps) {
  return (
    <div
      className="rounded-xl border border-graytext/30 bg-background p-6 shadow-sm animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-main/10">
          <ion-icon
            name={icon}
            style={{ fontSize: "20px", color: 'var(--main)' }}
          ></ion-icon>
        </div>
        <div className="text-2xl font-extrabold" style={{ color: 'var(--title-color)' }}>
          {value}
        </div>
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--graytext)' }}>
        {label}
      </p>
    </div>
  );
}

