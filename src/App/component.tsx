import { StrictMode } from "react";

import { BooksPage } from "@pages/Books";

import type React from "react";

export const App: React.FC = () => {
  return (
    <StrictMode>
      <BooksPage />
    </StrictMode>
  );
};
