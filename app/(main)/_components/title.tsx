"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDocumentStore } from "@/stores/use-document-store";

interface TitleProps {
  documentId: string;
}

const Title = ({ documentId }: { documentId: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const title = useDocumentStore(
    (state) => state.documents.find((doc) => doc.id === documentId)?.title
  );
  const updateTitle = useDocumentStore((state) => state.updateTitle);

  const [localTitle, setLocalTitle] = useState(title || "");

  useEffect(() => {
    setLocalTitle(title || "");
  }, [title]);

  const handleSubmit = async () => {
    setIsEditing(false);
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: localTitle }),
      });

      if (res.ok) {
        updateTitle(documentId, localTitle);
        toast.success("Title updated!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return isEditing ? (
    <Input
      ref={inputRef}
      value={localTitle}
      onChange={(e) => setLocalTitle(e.target.value)}
      onBlur={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") {
          setLocalTitle(title || "");
          setIsEditing(false);
        }
      }}
    />
  ) : (
    <span
      role="button"
      className="text-sm font-medium cursor-pointer"
      onClick={() => {
        setIsEditing(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }}
    >
      {localTitle || "Untitled"}
    </span>
  );
};

export default Title;
