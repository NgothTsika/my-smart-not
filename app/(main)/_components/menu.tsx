"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDocumentStore } from "@/stores/use-document-store";
import { MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface MenuProps {
  id?: string;
}

const Menu = ({ id }: MenuProps) => {
  const router = useRouter();
  const params = useParams();

  const removeDocument = useDocumentStore((state) => state.removeDocument);
  const onArchive = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;

    const promise = fetch(`/api/documents/${id}/archive`, {
      method: "PATCH",
    }).then(async (res) => {
      if (!res.ok) throw new Error("Archive failed");

      removeDocument(id);

      if (params.documentId === id) {
        router.push("/documents");
      }
    });

    toast.promise(Promise.resolve(), {
      loading: "Moving to trash...",
      success: "Note moved to the trash!",
      error: "Failed to archive note.",
    });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
          <div
            role="button"
            className="flex items-center justify-center p-1 cursor-pointer rounded-md hover:bg-muted hover:text-muted-foreground transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60"
          align="start"
          side="right"
          forceMount
        >
          <DropdownMenuItem onClick={onArchive}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Menu;
