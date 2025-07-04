import { create } from "zustand";

interface Document {
  id: string;
  title: string;
  icon?: string;
  parentDocumentId: string | null;
}

interface DocumentStore {
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  updateTitle: (id: string, title: string) => void;
  removeDocument: (id: string) => void;
  restoreDocument: (doc: Document) => void;
  addDocument: (doc: Document) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  setDocuments: (docs) => set({ documents: docs }),

  addDocument: (doc) =>
    set((state) => {
      const alreadyExists = state.documents.some((d) => d.id === doc.id);
      if (alreadyExists) return {};
      return { documents: [doc, ...state.documents] };
    }),

  updateTitle: (id, title) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, title } : doc
      ),
    })),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),

  restoreDocument: (doc: Document) =>
    set((state) => ({
      documents: [doc, ...state.documents],
    })),
}));
