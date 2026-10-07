import React from "react";

import { getIsPrivateBook } from "@entities/book/utils";

import styles from "./style.module.css";

import type { BookDto } from "@entities/book/api";

interface BookCardProps {
  book: BookDto;
  isPending?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, isPending = false }) => {
  const isPrivate = getIsPrivateBook(book.ownerId);

  const cardClassName = `${styles.card} ${isPending ? styles.pending : ""}`.trim();

  return (
    <article className={cardClassName}>
      <header className={styles.header}>
        <h4 className={styles.title}>{book.name}</h4>
        {isPrivate !== undefined && (
          <span
            className={`${styles.badge} ${isPrivate ? styles.badgePrivate : styles.badgePublic}`}
          >
            {isPrivate ? "Private" : "Public"}
          </span>
        )}
      </header>

      <div className={styles.content}>
        <p className={styles.author}>
          <strong>Author:</strong> {book.author}
        </p>
      </div>

      {isPending && <div className={styles.spinner}>Updating...</div>}
    </article>
  );
};
