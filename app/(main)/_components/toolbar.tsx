"use client";

import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/stores/use-document-store";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { IconPicker } from "./icon-picker";
import toast from "react-hot-toast";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
  initialData: {
    id: string;
    icon?: string;
    coverImage?: string;
    title?: string;
  };
  preview?: boolean;
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const router = useRouter();
  const inputRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title || "");
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const coverImage = useCoverImage();
  const updateTitleGlobally = useDocumentStore((state) => state.updateTitle);
  const updateIconGlobally = useDocumentStore((state) => state.updateIcon);

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const update = async (data: { id: string; title: string }) => {
    try {
      const res = await fetch(`/api/documents/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.title }),
      });

      if (!res.ok) throw new Error();

      updateTitleGlobally(data.id, data.title);
    } catch (err) {
      toast.error("Failed to update title");
    }
  };

  const updateIcon = async (icon: string) => {
    try {
      const res = await fetch(`/api/documents/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon }),
      });

      if (!res.ok) throw new Error();

      updateIconGlobally(initialData.id, icon); // ✅ Update Zustand
      router.refresh(); // Optional
    } catch (err) {
      toast.error("Failed to update icon");
    }
  };

  const onInput = (value: string) => {
    setHistory((prev) => [...prev, value]);
    setRedoStack([]);
    setValue(value);
    update({ id: initialData.id, title: value || "Untitled" });
  };

  const handleUndo = () => {
    if (history.length < 2) return;
    const last = history[history.length - 2];
    setRedoStack((prev) => [value || "", ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setValue(last);
    update({ id: initialData.id, title: last });
  };

  const handleRedo = () => {
    if (!redoStack.length) return;
    const [next, ...rest] = redoStack;
    setHistory((prev) => [...prev, next]);
    setRedoStack(rest);
    setValue(next || "");
    update({ id: initialData.id, title: next || "Untitled" });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={(emoji) => updateIcon(emoji)}>
            <p className="text-6xl hover:opacity-75 transition cursor-pointer">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={() => {}}
            variant="outline"
            size="icon"
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
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
        {!initialData.coverImage && !preview && (
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

      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] cursor-text"
          onClick={enableInput}
        >
          {value || "Untitled"}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
