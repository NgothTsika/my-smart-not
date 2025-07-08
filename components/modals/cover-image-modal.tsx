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

      const res = await edgestore.publicFiles.upload({
        file,
        options: { replaceTargetUrl: coverImage.url },
      });

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
            const res = await edgestore.publicFiles.upload({
              file,
              options: { replaceTargetUrl: coverImage.url },
            });
            return { url: res.url };
          }}
          onUploadCompleted={async (file) => {
            const response = await fetch(
              `/api/documents/${params.documentId}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ coverImage: file.url }),
              }
            );

            if (!response.ok) {
              toast.error("Failed to update cover");
              return;
            }

            updateCoverImage(params.documentId as string, file.url);
            toast.success("Cover image updated!");
            router.refresh();
            coverImage.onClose();
          }}
        >
          <SingleImageDropzone
            className="w-full outline-none"
            disabled={isSubmitting}
            value={file}
            onChange={setFile} // ← just update local state
          />
        </UploaderProvider>
      </DialogContent>
    </Dialog>
  );
};
