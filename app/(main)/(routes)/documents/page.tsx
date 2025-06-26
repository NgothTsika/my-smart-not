"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Documentspage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreate = async () => {
    const res = await fetch("/api/documents/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled",
        parentDocumentId: null,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // Navigate to the new document page if needed
      router.push(`/documents/${data.id}`);
      toast.promise(
        Promise.resolve(),
        {
          loading: "Creating a new note...",
          success: "New note created!",
          error: "Failed to create document.",
        },
        {
          position: "bottom-center",
          duration: 3000,
        }
      );
    } else if (data.error === "Unauthorized") {
      console.error("Unauthorized access:", data.error);
      alert("You must be logged in to create a document.");
      router.push("/auth"); // Redirect to the login page
    } else {
      console.error("Failed to create document:", data.error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Button className="cursor-pointer" onClick={handleCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
      <h2 className="uppercase text-lg font-medium">
        Welcome to <span>{session?.user?.name}</span>&apos;s NoteFlow
      </h2>
    </div>
  );
};

export default Documentspage;
