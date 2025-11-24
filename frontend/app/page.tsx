import Image from "next/image";

export default function Home() {
  return (
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
          className="w-full max-w-md rounded-lg border border-zinc-300 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20"
        />
      </div>
    </div>
  );
}
