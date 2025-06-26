"use client";

import { Spinner } from "@/components/spinner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Navigation } from "./_components/navigation";

const Mainlayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  if (status === "unauthenticated") {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F] bg-background">
      <Navigation />
      <div className=" flex-1 h-full overflow-y-auto">{children}</div>
    </div>
  );
};

export default Mainlayout;
