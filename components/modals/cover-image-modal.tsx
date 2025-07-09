"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "../upload/single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams, useRouter } from "next/navigation";
import { useDocumentStore } from "@/stores/use-document-store";
import toast from "react-hot-toast";
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

  const updateCover = async (url: string) => {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        payload: {
          id: params.documentId,
          coverImage: url,
        },
      }),
    });

    if (!res.ok) throw new Error("Failed to update document");

    updateCoverImage(params.documentId as string, url);
    toast.success("Cover image updated!");
    router.refresh();
    onClose();
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

      await updateCover(res.url);
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
            try {
              await updateCover(file.url);
            } catch {
              toast.error("Failed to update cover");
            }
          }}
        >
          <SingleImageDropzone
            className="w-full outline-none"
            disabled={isSubmitting}
            value={file}
            onChange={setFile}
          />
        </UploaderProvider>
      </DialogContent>
    </Dialog>
  );
};
