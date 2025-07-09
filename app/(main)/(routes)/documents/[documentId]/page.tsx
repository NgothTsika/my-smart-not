"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDocumentStore } from "@/stores/use-document-store";
import { Spinner } from "@/components/spinner";
import Toolbar from "@/app/(main)/_components/toolbar";
import toast from "react-hot-toast";
import { Cover } from "@/components/cover";
import { debounce } from "lodash";
import type { Document } from "@/types/document";
import Editor from "@/components/editor";

const DocumentIdPage = () => {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.documentId as string;

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  const setCurrentDocument = useDocumentStore(
    (state) => state.setCurrentDocument
  );

  const currentDoc = useDocumentStore((state) =>
    state.documents.find((d) => d.id === documentId)
  );

  useEffect(() => {
    let isMounted = true;

    const fetchDocument = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get",
            payload: { id: documentId },
          }),
        });

        if (!isMounted) return;

        if (res.ok) {
          const data: Document = await res.json();
          setCurrentDocument(data);
          setContent(data.content || "");
        } else if (res.status === 404) {
          toast.error("Document not found");
          router.replace("/error");
        } else {
          toast.error("Error loading document");
          router.replace("/error");
        }
      } catch (err) {
        toast.error("Something went wrong.");
        router.replace("/error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (documentId) fetchDocument();

    return () => {
      isMounted = false;
    };
  }, [documentId, router, setCurrentDocument]);

  const debouncedSave = useRef(
    debounce(async (newContent: string) => {
      try {
        const res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            payload: { id: documentId, content: newContent },
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to update content");
          return;
        }

        useDocumentStore.getState().setCurrentDocument({
          ...useDocumentStore.getState().currentDocument!,
          content: newContent,
        });
      } catch (err) {
        toast.error("Auto-save failed.");
        console.error(err);
      }
    }, 1000)
  ).current;

  const onChange = (value: string) => {
    setContent(value);
    debouncedSave(value);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentDoc) {
    return null;
  }

  return (
    <div className="pb-40">
      <Cover url={currentDoc.coverImage} documentId={currentDoc.id} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar />
        <Editor onChange={onChange} initialContent={content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
