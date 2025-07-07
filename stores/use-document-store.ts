import { create } from "zustand";
import type { Document } from "@/types/document";

interface DocumentStore {
  documents: Document[];
  currentDocument: Document | null;
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  restoreDocument: (doc: Document) => void;
  updateTitle: (id: string, title: string) => void;
  updateIcon: (id: string, icon: string) => void;
  updateCoverImage: (id: string, url: string | null) => void;
  setCurrentDocument: (doc: Document) => void;
  updateCurrentArchived: (isArchived: boolean) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  currentDocument: null,

  setDocuments: (docs) => set({ documents: docs }),

  addDocument: (doc) =>
    set((state) => {
      const exists = state.documents.some((d) => d.id === doc.id);
      if (exists) return {};
      return { documents: [doc, ...state.documents] };
    }),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),

  restoreDocument: (doc) =>
    set((state) => ({
      documents: [doc, ...state.documents],
    })),

  updateTitle: (id, title) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, title } : doc
      ),
      currentDocument:
        state.currentDocument?.id === id
          ? { ...state.currentDocument, title }
          : state.currentDocument,
    })),

  updateIcon: (id, icon) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, icon } : doc
      ),
      currentDocument:
        state.currentDocument?.id === id
          ? { ...state.currentDocument, icon }
          : state.currentDocument,
    })),

  updateCoverImage: (id, url) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, coverImage: url } : doc
      ),
      currentDocument:
        state.currentDocument?.id === id
          ? { ...state.currentDocument, coverImage: url }
          : state.currentDocument,
    })),

  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  updateCurrentArchived: (isArchived) =>
    set((state) => ({
      currentDocument: state.currentDocument
        ? { ...state.currentDocument, isArchived }
        : null,
    })),
}));
