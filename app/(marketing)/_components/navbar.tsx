"use client";

import { useRouter } from "next/navigation";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/Avatar";
import { useState } from "react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession(); // Use NextAuth's useSession hook
  const scroll = useScrollTop();
  const router = useRouter();
  const [showCard, setShowCard] = useState(false); // State to toggle the card visibility

  const handleLoginClick = () => {
    router.push("/auth"); // Redirect to the AuthForm page
  };

  const handleAvatarClick = () => {
    setShowCard((prev) => !prev); // Toggle the card visibility
  };

  const handleLogout = () => {
    signOut(); // Log out the user
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
            <div
              onClick={handleAvatarClick}
              className="cursor-pointer flex item-center gap-x-2"
            >
              <Button
                size="sm"
                variant="ghost"
                asChild
                className="cursor-pointer"
              >
                <Link href="/documents">Enter NoteFlow</Link>
              </Button>
              <div className="cursor-pointer">
                <Avatar
                  src={session.user.image || null} // Replace with the actual avatar URL from the session
                />
              </div>
            </div>
            {showCard && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 border-gray-400 rounded-md p-2 bg-accent">
                  {session.user.name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 border-gray-400 rounded-md p-2 bg-accent">
                  {session.user.email}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full text-red-500"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            )}
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
