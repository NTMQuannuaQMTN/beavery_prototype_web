"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import BotBar from "./botbar";
import IntroSplash from "@/components/IntroSplash";
// import ThemeToggle from "@/components/ThemeToggle";
import MainBackground from "@/components/MainBackground";

export default function Home() {
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
            Welcome to Beavery
          </h1>
          <input
            type="text"
            placeholder="eg. coffee in seoul"
            className="w-full rounded-lg border border-graytext px-4 py-3 text-[16px] font-medium placeholder:text-graytext focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20"
            style={{ color: 'var(--input-text)', caretColor: 'var(--input-text)' }}
          />
          <Link href="/login" className="w-full max-w-md">
            <Button>Log In</Button>
          </Link>
        </div>
      </MainBackground>
      <BotBar />
    </>
  );
}

