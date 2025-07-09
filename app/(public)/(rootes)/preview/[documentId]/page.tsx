"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { Cover } from "@/components/cover";
import Editor from "@/components/editor";
import { safeImageUrl } from "@/lib/safe-image-url";
import { toast } from "react-hot-toast";
import type { Document } from "@/types/document";
import Toolbar from "@/app/(main)/_components/toolbar";

const PreviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.documentId as string;

  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchPublishedDocument = async () => {
      if (!documentId) return;

      try {
        setLoading(true);

        const res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get",
            payload: { id: documentId },
          }),
        });

        if (!res.ok) {
          toast.error("Failed to fetch document.");
          router.replace("/error");
          return;
        }

        const data: Document = await res.json();

        if (!data || !data.isPublished) {
          toast.error("This document is not published.");
          router.replace("/error");
          return;
        }

        setDocument(data);
        setContent(data.content || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load document.");
        router.replace("/error");
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedDocument();
  }, [documentId, router]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="pb-40">
      <Cover
        preview
        url={safeImageUrl(document.coverImage)}
        documentId={document.id}
      />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar
          preview
          initialData={{
            ...document,
            coverImage: safeImageUrl(document.coverImage),
          }}
        />
        {content ? (
          <Editor
            editable={false}
            onChange={() => {}}
            initialContent={content}
          />
        ) : (
          <div className="text-muted-foreground text-center mt-10">
            This note has no content.
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
