"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useDocumentStore } from "@/stores/use-document-store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";

interface CoverProps {
  url?: string | null;
  preview?: boolean;
  documentId: string;
  loading?: boolean;
}

export const Cover = ({
  url,
  preview,
  documentId,
  loading = false,
}: CoverProps) => {
  const coverImage = useCoverImage();
  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const removeCoverImage = async () => {
    try {
      if (url) {
        await edgestore.publicFiles.delete({ url }); // ✅ Delete from EdgeStore if it exists
      }

      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage: null }), // ✅ Remove it in the database
      });

      if (!res.ok) throw new Error(); // ✅ Handle errors from the server

      useDocumentStore.getState().updateCoverImage(documentId, null); // ✅ Sync Zustand

      toast.success("Cover image removed"); // ✅ User feedback
      router.refresh(); // ✅ UI refresh
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove cover image"); // ✅ Error feedback
    }
  };

  return (
    <div
      className={cn(
        "relative w-full group transition-all duration-300",
        url ? "h-[35vh] bg-muted" : "h-[12vh]"
      )}
    >
      {loading ? (
        <Skeleton className="h-full w-full rounded-none" />
      ) : url ? (
        <Image
          src={url}
          alt="Cover image"
          fill
          priority
          className="object-cover w-full h-full"
          sizes="100vw"
        />
      ) : null}
      {url && !preview && (
        <div className=" opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className=" text-muted-foreground text-xs dark:text-white"
            variant="outline"
            size="sm"
          >
            <ImageIcon className=" h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={removeCoverImage}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};
