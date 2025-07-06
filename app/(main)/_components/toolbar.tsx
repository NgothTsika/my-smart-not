"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { IconPicker } from "./icon-picker";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ElementRef, useRef, useState } from "react";
import { title } from "process";
import TextareaAutosize from "react-textarea-autosize";

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
  const [value, setValue] = useState(initialData.title);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
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
      router.refresh();
    } catch (err) {
      toast.error("Failed to update title");
    }
  };

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData.id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const updateIcon = async (icon: string | null) => {
    try {
      const res = await fetch(`/api/documents/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon }),
      });

      if (!res.ok) throw new Error();
      router.refresh();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="pl-[54px] group relative ">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={(emoji) => updateIcon(emoji)}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={() => updateIcon(null)}
            variant="outline"
            size="icon"
            className=" rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
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
            className=" text-muted-foreground text-xs"
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
          className=" text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none "
        />
      ) : (
        <div
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] cursor-text"
          onClick={enableInput}
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
