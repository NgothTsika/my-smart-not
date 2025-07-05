export interface Document {
  id: string;
  title: string;
  icon?: string;
  parentDocumentId: string | null;
  isArchived?: boolean;
  content?: string;
}
