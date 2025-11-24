import Image from "next/image";
import Button from "@/components/Button";
import BotBar from "./botbar";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-8">
          <Image
            src="/logo/primaryblue.svg"
            alt="Beavery logo"
            width={200}
            height={60}
            priority
          />
          <h1 className="text-4xl font-extrabold text-black">
            Welcome to Beavery
          </h1>
          <input
            type="text"
            placeholder="eg. coffee in seoul"
            className="w-full rounded-lg border border-graytext px-4 py-3 text-[16px] text-black font-medium placeholder:text-graytext focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20"
          />
          <Button>Log In</Button>
        </div>
      </div>
      <BotBar />
    </>
  );
}

