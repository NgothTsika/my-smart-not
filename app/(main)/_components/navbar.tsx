"use client";

import { PanelLeft } from "lucide-react";
import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import type { Document } from "@/types/document";
import { useParams } from "next/navigation";
import { useDocumentStore } from "@/stores/use-document-store";
import Publish from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
  document?: Document | null;
}

export const NavBar = ({
  isCollapsed,
  onResetWidth,
  document,
}: NavbarProps) => {
  const params = useParams();

  const currentDoc = useDocumentStore((state) =>
    state.documents.find((d) => d.id === params.documentId)
  );
  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <PanelLeft
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          {currentDoc?.icon && (
            <span className="text-xl px-2">{currentDoc.icon}</span>
          )}
          {document ? (
            <div className="flex items-center justify-between w-full">
              <Title documentId={document.id} />
              <div className="flex items-center gap-x-2">
                <Publish initialData={document} />
                <Menu id={document.id} />
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Loading...</span>
          )}
        </div>
      </nav>
      {document?.isArchived && <Banner documentId={document.id} />}
    </>
  );
};
