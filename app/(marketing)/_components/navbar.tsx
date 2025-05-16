"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { Modetoggle } from "@/components/mode-toggle";

const Navbar = () => {
  const scroll = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6",
        scroll && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className=" flex items-center gap-x-2 w-full justify-between md:justify-end md:*:ml-auto ">
        <Modetoggle />
      </div>
    </div>
  );
};

export default Navbar;
