"use client";

import { useRouter } from "next/navigation";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import { useState } from "react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { UserItem } from "@/app/(main)/_components/user-item";

const Navbar = () => {
  const { data: session, status } = useSession();
  const scroll = useScrollTop();
  const router = useRouter();
  const [showCard, setShowCard] = useState(false);

  const handleLoginClick = () => {
    router.push("/auth");
  };

  const handleAvatarClick = () => {
    setShowCard((prev) => !prev);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1F1F1F] ",
        scroll && "border-b shadow-md"
      )}
    >
      <Logo />
      <div className="md:ml-auto justify-end w-full flex items-center gap-x-2">
        {status === "loading" && <Spinner />}
        {status !== "authenticated" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={handleLoginClick}
            >
              Log in
            </Button>
            <Button size="sm" className="cursor-pointer hidden md:block ">
              NoteFlow Free
            </Button>
          </>
        )}
        {status === "authenticated" && session?.user && (
          <div className="relative">
            <div className="cursor-pointer flex item-center gap-x-2">
              <Button size="sm" variant="ghost" asChild>
                <Link href="/documents">Enter NoteFlow</Link>
              </Button>
              <div onClick={handleAvatarClick} className="cursor-pointer">
                <Avatar src={session.user.image || null} />
              </div>
            </div>
            {showCard && <UserItem />}
          </div>
        )}
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
