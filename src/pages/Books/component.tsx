import React, { useState } from "react";

import { BookGateway } from "@entities/book/api";
import { API_CONFIG } from "@entities/book/configs";
import { BookController } from "@entities/book/controller";
import { BookStore, CreateBookFormStore } from "@entities/book/model";
import { BookHeaderWidget } from "@widgets/book/ui/BookHeder";
import { BookListWidget } from "@widgets/book/ui/BookList";

export const BooksPage: React.FC = () => {
  const [{ bookStore, bookController, formStore }] = useState(() => {
    const gateway = new BookGateway(API_CONFIG.USER_NAME);
    const bookStore = new BookStore();
    const formStore = new CreateBookFormStore();
    const bookController = new BookController(bookStore, formStore, gateway);

    return { bookStore, bookController, formStore };
  });

  return (
    <>
      <BookHeaderWidget bookStore={bookStore} />
      <BookListWidget formStore={formStore} bookStore={bookStore} controller={bookController} />
    </>
  );
};
