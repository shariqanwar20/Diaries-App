export interface Diary {
  id?: string;
  title: string;
  type: "private" | "public";
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  entryIds: string[] | null;
}
