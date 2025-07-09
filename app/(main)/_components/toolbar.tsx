"use client";

import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/stores/use-document-store";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { IconPicker } from "./icon-picker";
import toast from "react-hot-toast";
import { ElementRef, useRef, useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
  preview?: boolean;
}

const Toolbar = ({ preview }: ToolbarProps) => {
  const router = useRouter();
  const inputRef = useRef<ElementRef<"textarea">>(null);

  const coverImage = useCoverImage();

  const currentDocument = useDocumentStore((state) => state.currentDocument);
  const updateTitleGlobally = useDocumentStore((state) => state.updateTitle);
  const updateIconGlobally = useDocumentStore((state) => state.updateIcon);

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(currentDocument?.title || "");
  }, [currentDocument?.title]);

  const updateTitle = async (title: string) => {
    if (!currentDocument) return;
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          payload: {
            id: currentDocument.id,
            title,
          },
        }),
      });

      if (!res.ok) throw new Error();

      updateTitleGlobally(currentDocument.id, title);
    } catch (err) {
      toast.error("Failed to update title");
    }
  };

  const updateIcon = async (icon: string | null) => {
    if (!currentDocument) return;
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          payload: {
            id: currentDocument.id,
            icon,
          },
        }),
      });

      if (!res.ok) throw new Error();

      updateIconGlobally(currentDocument.id, icon);
      router.refresh();
    } catch (err) {
      toast.error("Failed to update icon");
    }
  };

  const handleTitleChange = (value: string) => {
    setValue(value);
    updateTitle(value || "Untitled");
  };

  if (!currentDocument) return null;

  return (
    <div className="pl-[54px] group relative">
      {/* Icon display */}
      {!!currentDocument.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={(emoji) => updateIcon(emoji)}>
            <p className="text-6xl hover:opacity-75 transition cursor-pointer">
              {currentDocument.icon}
            </p>
          </IconPicker>
          <Button
            onClick={() => updateIcon(null)}
            variant="ghost"
            size="icon"
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!currentDocument.icon && preview && (
        <p className="text-6xl pt-6">{currentDocument.icon}</p>
      )}

      {/* Icon & Cover buttons */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!currentDocument.icon && !preview && (
          <IconPicker onChange={(emoji) => updateIcon(emoji)} asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground text-xs"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!currentDocument.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Cover
          </Button>
        )}
      </div>

      {/* Title editing */}
      <TextareaAutosize
        ref={inputRef}
        value={value}
        onChange={(e) => handleTitleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none border-none focus-visible:ring-0 focus-visible:outline-none"
        placeholder="Untitled"
      />
    </div>
  );
};

export default Toolbar;
