import GradientBackground from "@/components/GradientBackground";
import Header from "../components/header";
import BotBar from "@/app/(landing)/botbar";

export default function TermsPage() {
  return (
    <>
      <GradientBackground className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-4xl font-extrabold text-black">Terms</h1>
            <p className="text-sm text-graytext">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-base text-graytext">This is to be updated</p>
          </div>
        </div>
      </GradientBackground>
      <BotBar />
    </>
  );
}

