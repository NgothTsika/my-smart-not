"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "../upload/single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams, useRouter } from "next/navigation";
import { useDocumentStore } from "@/stores/use-document-store";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";
import { UploaderProvider } from "@/components/upload/uploader-provider";

export const CoverImageModal = () => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const params = useParams();
  const router = useRouter();
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();
  const updateCoverImage = useDocumentStore((state) => state.updateCoverImage);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    setSuccess(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (!file || !params?.documentId) return;

    try {
      setIsSubmitting(true);
      setFile(file);

      // Upload file to EdgeStore
      const res = await edgestore.publicFiles.upload({ file });

      // Update coverImage in DB
      const response = await fetch(`/api/documents/${params.documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage: res.url }),
      });

      if (!response.ok) throw new Error();

      // Update Zustand store
      updateCoverImage(params.documentId as string, res.url);

      setSuccess(true);
      toast.success("Cover image updated!");
      router.refresh();
      onClose();
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cover Image</DialogTitle>
        </DialogHeader>

        <UploaderProvider
          autoUpload
          uploadFn={async ({ file }) => {
            const res = await edgestore.publicFiles.upload({ file });
            return { url: res.url };
          }}
        >
          <div className="space-y-4">
            {success ? (
              <div className="flex flex-col items-center justify-center text-green-600">
                <CheckCircle2 className="w-12 h-12" />
                <p className="text-sm font-medium mt-2">Cover image updated!</p>
              </div>
            ) : (
              <>
                <SingleImageDropzone
                  className="w-full outline-none"
                  disabled={isSubmitting}
                  value={file}
                  onChange={onChange} // ✅ Custom file change handler
                />
                <p className="text-sm text-muted-foreground text-center">
                  Recommended: 16:9 aspect ratio
                </p>
              </>
            )}
          </div>
        </UploaderProvider>
      </DialogContent>
    </Dialog>
  );
};
