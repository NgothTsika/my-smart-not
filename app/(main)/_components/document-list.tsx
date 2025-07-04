"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { useDocumentStore } from "@/stores/use-document-store";

interface DocumentListProps {
  parentDocumentId?: string | null;
  level?: number;
}

export const DocumentList = ({
  parentDocumentId = null,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const documents = useDocumentStore((state) => state.documents);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const handleDocumentClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const filteredDocuments = documents.filter(
    (doc) => doc.parentDocumentId === parentDocumentId
  );

  if (filteredDocuments.length === 0) {
    return (
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "text-sm font-medium text-muted-foreground/80 px-4",
          level > 0 ? "block" : "hidden"
        )}
      >
        No pages inside
      </p>
    );
  }

  return (
    <>
      {filteredDocuments.map((doc) => (
        <div key={doc.id} className="w-full">
          <Item
            id={doc.id}
            onClick={() => handleDocumentClick(doc.id)}
            label={doc.title || "Untitled"}
            icon={FileIcon}
            documentIcon={doc.icon}
            active={params?.documentId === doc.id}
            level={level}
            onExpand={() => onExpand(doc.id)}
            expanded={expanded[doc.id]}
          />
          {expanded[doc.id] && (
            <DocumentList parentDocumentId={doc.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
