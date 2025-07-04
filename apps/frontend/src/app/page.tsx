import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col mt-14 lg:mx-64">
      <header className="w-full flex justify-between">
        <h1 className="text-5xl font-thin font-serif">
          ArthJyoti:{" "}
          <span className="text-foreground/60">A finance manager app</span>
        </h1>
        <div className="flex items-center">
          <ToggleTheme />
        </div>
      </header>
      <div className="mt-14 flex flex-col gap-6">
        <Link href={"/auth/sign-up"}>
          <Button className="font-serif font-extralight text-lg">
            Register new account
          </Button>
        </Link>
        <Link href={"/auth/sign-in"}>
          <Button className="font-serif font-extralight text-lg">
            Login into existing account
          </Button>
        </Link>
      </div>
    </div>
  );
}
