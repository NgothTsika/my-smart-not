"use client";

import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Undo2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useDocumentStore } from "@/stores/use-document-store";
import type { Document } from "@/types/document";

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const restoreDocument = useDocumentStore((state) => state.restoreDocument);
  const [documents, setDocuments] = useState<Document[] | undefined>(undefined);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const res = await fetch("/api/documents/trash");
        const data = await res.json();
        if (res.ok) setDocuments(data);
        else toast.error(data.error || "Failed to fetch trash.");
      } catch (error) {
        toast.error("Error loading trash.");
      }
    };
    fetchTrash();
  }, []);

  const handleRestore = async (id: string) => {
    const promise = fetch(`/api/documents/${id}/restore`, {
      method: "PATCH",
    }).then(async (res) => {
      if (!res.ok) throw new Error("Restore failed");

      const data = await res.json();

      restoreDocument(data); // ✅ Updates Zustand (re-renders sidebar)
      setDocuments((prev) => prev?.filter((doc) => doc.id !== id)); // ✅ Clean trash view
    });

    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored!",
      error: "Failed to restore document.",
    });
  };

  const handlePermanentDelete = async (id: string) => {
    const promise = fetch(`/api/documents/${id}/delete`, {
      method: "DELETE",
    }).then(() => {
      setDocuments((prev) => prev?.filter((doc) => doc.id !== id));

      if (params.documentId === id) {
        router.push("/documents");
      }
    });

    toast.promise(promise, {
      loading: "Deleting document...",
      success: "Document permanently deleted!",
      error: "Failed to delete document.",
    });
  };

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase())
  );

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>

      <div className="mt-2 px-1 pb-1 space-y-2">
        {filteredDocuments?.length === 0 && (
          <p className="text-xs text-center text-muted-foreground py-4">
            No documents found.
          </p>
        )}

        {filteredDocuments?.map((doc) => (
          <div
            key={doc.id}
            className="border bg-muted/40 rounded-sm p-3 flex items-center justify-between"
          >
            <span
              onClick={() => router.push(`/documents/${doc.id}`)}
              className="cursor-pointer hover:underline"
            >
              {doc.title || "Untitled"}
            </span>

            <div className="flex gap-x-2">
              <Button
                onClick={() => handleRestore(doc.id)}
                variant="ghost"
                size="sm"
              >
                <Undo2 className="h-4 w-4 mr-1" />
              </Button>
              <ConfirmModal onConfirm={() => handlePermanentDelete(doc.id)}>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                </Button>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
