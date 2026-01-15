// ✅ REFACTORED NavBar.tsx
"use client";

import { PanelLeft } from "lucide-react";
import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";
import { useDocumentStore } from "@/stores/use-document-store";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const NavBar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const currentDoc = useDocumentStore((state) => state.currentDocument);

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

          {currentDoc ? (
            <div className="flex items-center justify-between w-full">
              <Title />
              <div className="flex items-center gap-x-2">
                <Publish initialData={currentDoc} />
                <Menu id={currentDoc.id} />
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Loading...</span>
          )}
        </div>
      </nav>

      {currentDoc?.isArchived && <Banner documentId={currentDoc.id} />}
    </>
  );
};
