"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDocumentStore } from "@/stores/use-document-store";

interface TitleProps {
  initialData: string;
  documentId: string;
}

const Title = ({ initialData, documentId }: TitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTitleGlobally = useDocumentStore((state) => state.updateTitle);

  useEffect(() => {
    setTitle(initialData);
  }, [initialData]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    setIsEditing(false);
    const finalTitle = title.trim() || "Untitled"; // ✅ Default here

    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: finalTitle }),
      });

      if (res.ok) {
        updateTitleGlobally(documentId, finalTitle); // ✅ Update global store
        toast.promise(
          Promise.resolve(),
          {
            loading: "Update a new note...",
            success: "Title updated successfully!",
            error: "Failed to update document.",
          },
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
        setTitle(finalTitle); // ✅ Update local state in case it was empty
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update title.");
      }
    } catch (error) {
      toast.error("Failed to update title.");
      console.error("Error updating title:", error);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setTitle(initialData);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value || "Untitled");
  };

  const enableInput = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  return (
    <div className="flex items-center gap-x-2">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={title}
          onChange={handleChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium"
        />
      ) : (
        <span
          role="button"
          onClick={enableInput}
          className="text-sm font-medium cursor-pointer"
        >
          {title || "Untitled"}
        </span>
      )}
    </div>
  );
};

export default Title;
