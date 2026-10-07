import React, { useEffect } from "react";

import { BookCard } from "@entities/book/ui/BookCard";
import { CreateBookFeature } from "@features/book/ui/CreateBook";
import { FilterBookFeature } from "@features/book/ui/FilterBook";
import { observer } from "mobx-react-lite";

import styles from "./style.module.css";

import type { BookController } from "@entities/book/controller";
import type { BookStore, CreateBookFormStore } from "@entities/book/model";

interface BookListWidgetProps {
  bookStore: BookStore;
  formStore: CreateBookFormStore;
  controller: BookController;
}

export const BookListWidget: React.FC<BookListWidgetProps> = observer(
  ({ bookStore, controller, formStore }) => {
    useEffect(() => {
      void controller.loadBooks();
      return () => controller.destroy();
    }, [controller]);

    return (
      <div className={styles.container}>
        {bookStore.error && <div className={styles.error}>{bookStore.error}</div>}

        <header className={styles.header}>
          <h3 className={styles.title}>Book List</h3>
          <FilterBookFeature store={bookStore} controller={controller} />
          <CreateBookFeature formStore={formStore} controller={controller} />
        </header>

        {!bookStore.isLoaded && <div className={styles.message}>Loading books...</div>}

        {bookStore.isLoaded &&
          (bookStore.books.length > 0 ? (
            <ul className={styles.list}>
              {bookStore.books.map((book) => (
                <BookCard key={book.id} book={book} isPending={bookStore.isPending} />
              ))}
            </ul>
          ) : (
            <div className={styles.message}>Book list is empty</div>
          ))}
      </div>
    );
  }
);
