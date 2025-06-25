"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  const scroll = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1F1F1F] ",
        scroll && "border-b shadow-md"
      )}
    >
      <Logo />
      <div className="md:ml-auto justify-end w-full flex items-center gap-x-2">
        Login
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
