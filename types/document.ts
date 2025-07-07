export interface Document {
  id: string;
  title: string;
  icon?: string;
  coverImage?: string | null;
  parentDocumentId: string | null;
  isArchived?: boolean;
  content?: string;
}
