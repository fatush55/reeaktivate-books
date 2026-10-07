import React from "react";

import { observer } from "mobx-react-lite";

import styles from "./style.module.css";

import type { BookController } from "@entities/book/controller";
import type { CreateBookFormStore } from "@entities/book/model";

interface CreateBookFeatureProps {
  formStore: CreateBookFormStore;
  controller: BookController;
}

export const CreateBookFeature: React.FC<CreateBookFeatureProps> = observer(
  ({ formStore, controller }) => {
    const titleError = formStore.validationError?.title;
    const authorError = formStore.validationError?.author;

    const handleToggleMode = () => {
      controller.toggleFormMode();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      controller.changeTitleField(e.target.value);
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      controller.changeAuthorField(e.target.value);
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      void controller.createBook();
    };

    return !formStore.isCreateMode ? (
      <div className={styles.container}>
        <button type="button" className={styles.toggleBtn} onClick={handleToggleMode}>
          + Add Book
        </button>
      </div>
    ) : (
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h4 className={styles.formTitle}>Create New Book</h4>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="book-title">
              Title
            </label>
            <input
              id="book-title"
              type="text"
              className={`${styles.input} ${titleError ? styles.inputError : ""}`.trim()}
              value={formStore.title}
              onChange={handleTitleChange}
              placeholder="Enter book title"
              disabled={formStore.isSubmitting}
            />
            {titleError && <span className={styles.errorText}>{titleError}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="book-author">
              Author
            </label>
            <input
              id="book-author"
              type="text"
              className={`${styles.input} ${authorError ? styles.inputError : ""}`.trim()}
              value={formStore.author}
              onChange={handleAuthorChange}
              placeholder="Enter author name"
              disabled={formStore.isSubmitting}
            />
            {authorError && <span className={styles.errorText}>{authorError}</span>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleToggleMode}
              disabled={formStore.isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!formStore.isValidForm || formStore.isSubmitting}
            >
              {formStore.isSubmitting ? "Creating..." : "Save Book"}
            </button>
          </div>
        </form>
      </div>
    );
  }
);
