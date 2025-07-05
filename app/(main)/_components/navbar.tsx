"use client";

import { PanelLeft } from "lucide-react";
import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import type { Document } from "@/types/document";

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
          {document ? (
            <div className="flex items-center justify-between w-full">
              <Title initialData={document.title} documentId={document.id} />
              <div className="flex items-center gap-x-2">
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
