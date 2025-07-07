"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDocumentStore } from "@/stores/use-document-store";
import { Spinner } from "@/components/spinner";
import Toolbar from "@/app/(main)/_components/toolbar";
import toast from "react-hot-toast";
import { Cover } from "@/components/cover";
import type { Document } from "@/types/document";
import { safeImageUrl } from "@/lib/safe-image-url";

const DocumentIdPage = () => {
  const params = useParams();
  const documentId = params?.documentId as string;

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  const setCurrentDocument = useDocumentStore(
    (state) => state.setCurrentDocument
  );
  const currentDoc = useDocumentStore((state) =>
    state.documents.find((d) => d.id === documentId)
  );

  const fetchDocument = async () => {
    try {
      const res = await fetch(`/api/documents/${documentId}`);
      const data: Document = await res.json();

      if (res.ok) {
        setCurrentDocument(data);
      } else if (res.status === 404) {
        toast.error("Document not found");
      } else {
        toast.error("Error loading document");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchDocument();
  }, [documentId]);

  useEffect(() => {
    if (currentDoc?.content) {
      setContent(currentDoc.content);
    }
  }, [currentDoc]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentDoc) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        Document not found.
      </div>
    );
  }

  return (
    <div className="pb-40">
      <Cover url={safeImageUrl(currentDoc.coverImage)} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar
          initialData={{
            ...currentDoc,
            coverImage: safeImageUrl(currentDoc.coverImage),
          }}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
