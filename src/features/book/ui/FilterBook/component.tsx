import React, { useCallback } from "react";

import { observer } from "mobx-react-lite";

import styles from "./style.module.css";

import type { BookController } from "@entities/book/controller";
import type { BookFilter, BookStore } from "@entities/book/model";

interface FilterBookFeatureProps {
  store: BookStore;
  controller: BookController;
}

export const FilterBookFeature: React.FC<FilterBookFeatureProps> = observer(
  ({ store, controller }) => {
    const currentView = store.filter.view;

    const handleFilterChange = useCallback(
      (view: BookFilter["view"]) => {
        return () => {
          void controller.changeFilterView(view);
        };
      },
      [controller]
    );

    return (
      <section className={styles.filterGroup}>
        <label className={styles.label}>
          <input
            type="radio"
            name="book-filter"
            value="all"
            className={styles.radio}
            checked={currentView === "all"}
            onChange={handleFilterChange("all")}
          />
          All Books
        </label>

        <label className={styles.label}>
          <input
            type="radio"
            name="book-filter"
            value="private"
            className={styles.radio}
            checked={currentView === "private"}
            onChange={handleFilterChange("private")}
          />
          Private Books
        </label>
      </section>
    );
  }
);
