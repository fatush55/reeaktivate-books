export interface BookFilter {
  view: "all" | "private";
}

export interface CreateBookValidationError {
  title?: string;
  author?: string;
}
