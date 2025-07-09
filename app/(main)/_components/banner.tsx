"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useDocumentStore } from "@/stores/use-document-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BannerProps {
  documentId: string;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const setCurrentDocument = useDocumentStore(
    (state) => state.setCurrentDocument
  );
  const restoreDocument = useDocumentStore((state) => state.restoreDocument);

  const handleRestore = async () => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restore",
          payload: { id: documentId },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        restoreDocument(data);
        router.refresh();
        toast.success("Document restored!");
      } else {
        toast.error(data.error || "Failed to restore.");
      }
    } catch (error) {
      console.error("Restore failed:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          payload: { id: documentId },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Document deleted permanently!");
        router.push("/documents");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to delete document.");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting.");
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-md text-sm mb-4 flex items-center justify-between">
      <span>⚠️ This document is archived. You may restore or delete it.</span>

      <div className="flex gap-x-2">
        <button
          onClick={handleRestore}
          className="text-xs px-3 py-1 bg-yellow-300 text-yellow-900 rounded hover:bg-yellow-400 font-medium"
        >
          Restore
        </button>

        <ConfirmModal onConfirm={handleDelete}>
          <button className="text-xs px-3 py-1 bg-red-200 text-red-900 rounded hover:bg-red-300 font-medium">
            Delete
          </button>
        </ConfirmModal>
      </div>
    </div>
  );
};

export default Banner;
