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
  updateIcon: (id: string, icon: string | null) => void;
  updateCoverImage: (id: string, coverImage: string | null) => void;
  setCurrentDocument: (doc: Document | null) => void;
  updateCurrentArchived: (id: string, isArchived: boolean) => void;
  updateCurrentPublished: (id: string, isPublished: boolean) => void;
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

  updateCoverImage: (id, coverImage) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, coverImage } : doc
      ),
      currentDocument:
        state.currentDocument?.id === id
          ? { ...state.currentDocument, coverImage }
          : state.currentDocument,
    })),

  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  updateCurrentArchived: (id, isArchived) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, isArchived } : doc
      ),
      currentDocument:
        state.currentDocument?.id === id
          ? { ...state.currentDocument, isArchived }
          : state.currentDocument,
    })),

  updateCurrentPublished: (id, isPublished) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, isPublished } : doc
      ),
      currentDocument:
        state.currentDocument?.id === id
          ? { ...state.currentDocument, isPublished }
          : state.currentDocument,
    })),
}));
