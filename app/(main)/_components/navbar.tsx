"use client";

import { PanelLeft } from "lucide-react";
import Title from "./title";
import Banner from "./banner";

interface Document {
  id: string;
  title: string;
  isArchived?: boolean;
}

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
            <Title initialData={document.title} documentId={document.id} />
          ) : (
            <span className="text-sm text-muted-foreground">Loading...</span>
          )}
        </div>
      </nav>
      {document?.isArchived && <Banner documentId={document.id} />}
    </>
  );
};
