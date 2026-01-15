"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface DocumentEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const DocumentEditor = ({ content, onUpdate }: DocumentEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  return (
    <div className="prose dark:prose-invert max-w-none mt-4 border rounded-md p-4 bg-background">
      <EditorContent editor={editor} />
    </div>
  );
};

export default DocumentEditor;
