"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";

const Documentspage = () => {
  const { data: session } = useSession();

  return (
    <div className=" h-full flex flex-col items-center justify-center space-y-4">
      <Button className=" cursor-pointer">
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
      <h2 className="uppercase text-lg font-medium">
        Welcome to <span>{session?.user?.name}</span>
        &apos;s NoteFlow
      </h2>
    </div>
  );
};

export default Documentspage;
