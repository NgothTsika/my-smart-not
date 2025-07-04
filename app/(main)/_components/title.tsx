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

  useEffect(() => {
    setTitle(initialData);
  }, [initialData]);

  const handleSubmit = async () => {
    setIsEditing(false);

    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        toast.success("Title updated successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update title.");
      }
    } catch (error) {
      toast.error("Failed to update title.");
      console.error("Error updating title:", error);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          className="text-sm font-medium"
        />
      ) : (
        <span
          role="button"
          onClick={() => setIsEditing(true)}
          className="text-sm font-medium cursor-pointer"
        >
          {title || "Untitled"}
        </span>
      )}
      <Button
        onClick={() => setIsEditing(true)}
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
      >
        Edit
      </Button>
    </div>
  );
};

export default Title;
