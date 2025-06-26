"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "@/components/Avatar";
import { ChevronsLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const UserItem = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut(); // Log out the user
    redirect("/"); // Redirect to the main page
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div
          role="button"
          className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
        >
          <div className=" gap-x-2 flex items-center max-w-[150px]">
            <Avatar src={session?.user?.image} />
            <span className=" text-start font-medium line-clamp-1">
              {session?.user?.name || "Guest"}&apos;s NoteFlow
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className=" w-80 z-[99999]"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className=" text-xs font-medium leading-none">
            {session?.user?.email || "No email provided"}
          </p>
          <div className=" flex items-center gap-x-2">
            <div className=" rounded-md p-1">
              <Avatar src={session?.user?.image} />
            </div>
            <div className=" space-y-1">
              <p className="text-sm line-clamp-1">
                {session?.user?.name || "Guest"}&apos;s NoteFlow
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className=" w-full cursor-pointer text-muted-foreground"
        >
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-red-500"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
