"use client";

import { useEffect, useState } from "react";
import { useDocumentStore } from "@/stores/use-document-store";
import Title from "@/app/(main)/_components/title";
import Banner from "@/app/(main)/_components/banner";
import { Spinner } from "@/components/spinner";
import toast from "react-hot-toast";
import DocumentEditor from "@/app/(main)/_components/document-editor";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  // const setCurrentDocument = useDocumentStore(
  //   (state) => state.setCurrentDocument
  // );

  // const currentDocument = useDocumentStore((state) => state.currentDocument);

  // const [loading, setLoading] = useState(true);
  // const [content, setContent] = useState("");

  // const fetchDocument = async () => {
  //   try {
  //     const res = await fetch(`/api/documents/${documentId}`);
  //     const data = await res.json();

  //     if (res.ok) {
  //       setCurrentDocument(data);
  //     } else if (res.status === 404) {
  //       toast.error("Document not found");
  //     } else {
  //       toast.error("Error loading document");
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong.");
  //     console.error("Fetch error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchDocument();
  // }, [params.documentId]);

  // useEffect(() => {
  //   if (currentDocument?.content) {
  //     setContent(currentDocument.content);
  //   }
  // }, [currentDocument]);

  // const handleContentUpdate = (html: string) => {
  //   setContent(html);
  //   // TODO: Save content to backend (optional)
  // };

  // if (loading) {
  //   return (
  //     <div className="h-full w-full flex items-center justify-center">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

  // if (!currentDocument) {
  //   return (
  //     <div className="h-full w-full flex items-center justify-center text-muted-foreground">
  //       Document not found.
  //     </div>
  //   );
  // }

  return <div>Document</div>;
};

export default DocumentIdPage;
