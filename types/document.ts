export interface Document {
  id: string;
  title: string;
  icon?: string | null;
  coverImage?: string | null;
  parentDocumentId: string | null;
  isArchived?: boolean;
  isPublished?: boolean;
  content?: string;
}
