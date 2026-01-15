"use client";

import { Button } from "@/components/ui/button";
import { useDocumentStore } from "@/stores/use-document-store";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DocumentsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const addDocument = useDocumentStore((state) => state.addDocument);

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          payload: {
            title: "Untitled",
            parentDocumentId: null,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        addDocument(data);
        router.push(`/documents/${data.id}`);
        toast.success("New note created!");
      } else if (data.error === "Unauthorized") {
        console.error("Unauthorized access:", data.error);
        alert("You must be logged in to create a document.");
        router.push("/auth");
      } else {
        console.error("Failed to create document:", data.error);
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error("Create error:", err);
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

export default DocumentsPage;
