"use client";

import {
  ChevronLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { UserItem } from "./user-item";
import { Item } from "./item";
import { DocumentList } from "./document-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TrashBox from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { NavBar } from "./navbar";

import { useDocumentStore } from "@/stores/use-document-store";
import type { Document } from "@/types/document";

export const Navigation = () => {
  const search = useSearch();
  const setting = useSettings();

  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const setDocuments = useDocumentStore((state) => state.setDocuments);
  const updateTitle = useDocumentStore((state) => state.updateTitle);
  const addDocument = useDocumentStore((state) => state.addDocument);

  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (res.ok) setDocuments(data);
      else console.error("Error fetching documents:", data.error);
    } catch (err) {
      console.error("Fetch exception:", err);
    }
  };

  const fetchCurrentDocument = async () => {
    const rawId = params.documentId;
    const documentId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!documentId) return;

    try {
      const res = await fetch(`/api/documents/${documentId}`);
      const data = await res.json();
      if (res.ok) {
        setCurrentDocument({
          id: documentId,
          title: data.title,
          parentDocumentId: data.parentDocumentId ?? null,
          icon: data.icon ?? undefined,
          isArchived: data.isArchived,
        });

        updateTitle(documentId, data.title);
      } else if (res.status === 404) {
        router.push("/documents");
      } else {
        console.error("Error loading document title:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (isMobile) collapse();
    else resetWidth();
  }, [pathname, isMobile]);

  useEffect(() => {
    fetchCurrentDocument();
  }, [params.documentId]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = Math.max(240, Math.min(480, e.clientX));
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.left = `${newWidth}px`;
      navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.width = isMobile ? "0" : "calc(100% - 240px)";
      navbarRef.current.style.left = isMobile ? "100%" : "240px";
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.width = "100%";
      navbarRef.current.style.left = "0";
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/documents/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled", parentDocumentId: null }),
      });

      const data = await res.json();

      if (res.ok) {
        addDocument(data);
        toast.promise(
          Promise.resolve(),
          {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create document.",
          },
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
        router.push(`/documents/${data.id}`);
      } else if (data.error === "Unauthorized") {
        alert("You must be logged in to create a document.");
        router.push("/auth");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error("Error creating document.");
      console.error(err);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition cursor-pointer",
            isMobile && "opacity-100"
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </div>

        <div>
          <UserItem />
          <Item onClick={search.onOpen} label="Search" icon={Search} isSearch />
          <Item onClick={setting.onOpen} label="Settings" icon={Settings} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>

        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} icon={Plus} label="Add a page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="p-0 w-72"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <NavBar
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
            document={currentDocument}
          />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full ">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
