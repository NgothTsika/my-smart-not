"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDocumentStore } from "@/stores/use-document-store";

const Title = () => {
  const currentDocument = useDocumentStore((state) => state.currentDocument);
  const updateTitle = useDocumentStore((state) => state.updateTitle);

  const [localTitle, setLocalTitle] = useState(currentDocument?.title || "");

  useEffect(() => {
    setLocalTitle(currentDocument?.title || "");
  }, [currentDocument?.title]);

  const handleChange = async (value: string) => {
    setLocalTitle(value);
    if (!currentDocument) return;

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          payload: { id: currentDocument.id, title: value },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update.");
        return;
      }

      updateTitle(currentDocument.id, value);
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Input
      value={localTitle}
      onChange={(e) => handleChange(e.target.value)}
      className="text-sm font-medium px-0 py-0 border-none shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 bg-transparent"
    />
  );
};

export default Title;
