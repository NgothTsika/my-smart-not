"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

import { useTheme } from "next-themes";
import { useEffect } from "react";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export const Editor = ({
  onChange,
  initialContent,
  editable = true,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  useEffect(() => {
    const handleChange = async () => {
      const json = await editor.document;
      onChange(JSON.stringify(json));
    };

    return editor.onEditorContentChange(handleChange);
  }, [editor, onChange]);

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable} // ✅ correct place
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};
