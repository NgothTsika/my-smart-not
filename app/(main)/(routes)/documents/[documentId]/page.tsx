"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useDocumentStore } from "@/stores/use-document-store";
import { Spinner } from "@/components/spinner";
import Toolbar from "@/app/(main)/_components/toolbar";
import toast from "react-hot-toast";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: string;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { documentId } = use(params); // ✅ unwrap async params

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  const setCurrentDocument = useDocumentStore(
    (state) => state.setCurrentDocument
  );
  const currentDocument = useDocumentStore((state) => state.currentDocument);

  const fetchDocument = async () => {
    try {
      const res = await fetch(`/api/documents/${documentId}`);
      const data = await res.json();

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
    fetchDocument();
  }, [documentId]);

  useEffect(() => {
    if (currentDocument?.content) {
      setContent(currentDocument.content);
    }
  }, [currentDocument]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        Document not found.
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={currentDocument} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
