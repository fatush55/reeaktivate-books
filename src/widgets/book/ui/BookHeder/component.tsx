import React from "react";

import { observer } from "mobx-react-lite";

import styles from "./style.module.css";

import type { BookStore } from "@entities/book/model";

interface BookHeaderWidgetProps {
  bookStore: BookStore;
}

export const BookHeaderWidget: React.FC<BookHeaderWidgetProps> = observer(({ bookStore }) => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Library Dashboard</h2>
      <div className={styles.counter}>
        <span>Your books:</span>
        <strong>{bookStore.isLoaded ? bookStore.privateBooksCount : "..."}</strong>
      </div>
    </header>
  );
});
