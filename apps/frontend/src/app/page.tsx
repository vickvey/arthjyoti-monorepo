import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LandingPage() {
  const data = await fetch("http://localhost:5500/api/health");
  const isBackendConnected = (await data.json())["success"];

  return (
    <div className="flex flex-col items-center mt-14">
      <div className="flex gap-14 items-center">
        <ToggleTheme />
        {isBackendConnected ? (
          <div>Backend Connected</div>
        ) : (
          <div>Backend is not connected</div>
        )}
      </div>
      <h1 className="">
        <span className="text-4xl font-medium text-foreground/90">Arth</span>
        <span className="text-5xl font-thin">Jyoti</span>
        <span className="text-4xl font-thin text-foreground/70">.com</span>
      </h1>
      <Button className="px-5 py-2 mt-6">
        <Link href={"/sign-up"}>Sign Up</Link>
      </Button>
    </div>
  );
}
