"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";

interface CoverProps {
  url?: string;
  preview?: boolean;
  loading?: boolean;
}

export const Cover = ({ url, preview, loading = false }: CoverProps) => {
  const coverImage = useCoverImage();
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
            onClick={coverImage.onOpen}
            className=" text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className=" h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={() => {}}
            className=" text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className=" h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};
