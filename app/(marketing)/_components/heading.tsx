"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Heading = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth");
  };

  return (
    <div className="max-w-3xl space-y-2 mt-3">
      <h1 className="text-3xl sm:text-5xl md:text-4xl font-bold">
        Stay Focused. Stay Organized. Welcome to{" "}
        <span className="underline">NoteFlow</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notes, tasks, and projects — all in sync, all in one place.
      </h3>

      {status === "loading" && (
        <div className="flex items-center justify-center w-full">
          <Spinner size="lg" />
        </div>
      )}

      {status === "unauthenticated" && (
        <Button onClick={handleLoginClick}>
          Get Started with NoteFlow
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}

      {status === "authenticated" && session?.user && (
        <Button>
          Go to Your Workspace
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default Heading;
