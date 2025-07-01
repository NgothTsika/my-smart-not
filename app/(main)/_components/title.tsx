"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface TitleProps {
  initialData: string;
  documentId: string;
}

const Title = ({ initialData, documentId }: TitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    setIsEditing(false);

    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update");

      // Optional: show success toast
      toast.success("Title updated!");
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Failed to update title.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      {isEditing ? (
        <Input
          ref={inputRef}
          className="h-7 px-2 focus-visible:ring-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
          onClick={() => setIsEditing(true)}
        >
          {title || "Untitled"}
        </Button>
      )}
    </div>
  );
};

export default Title;
