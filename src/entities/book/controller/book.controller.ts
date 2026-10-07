import { API_CONFIG } from "@entities/book/configs";

import type { BookDto, BookGateway } from "../api";
import type {
  BookFilter,
  BookStore,
  CreateBookFormStore,
  CreateBookValidationError,
} from "../model";

export class BookController {
  protected readonly TEXT_FIELD_MIN_LENGTH: number = 3;
  protected readonly TEXT_FIELD_MAX_LENGTH: number = 50;

  constructor(
    private readonly bookStore: BookStore,
    private readonly createBookFormStore: CreateBookFormStore,
    private readonly bookGateway: BookGateway
  ) {}

  protected validateField(value: string, filedName: keyof CreateBookValidationError) {
    if (!value.length) {
      this.createBookFormStore.validationError = {
        [filedName]: `The ${filedName} is required`,
      };
    } else if (
      value.length > this.TEXT_FIELD_MAX_LENGTH ||
      value.length < this.TEXT_FIELD_MIN_LENGTH
    ) {
      this.createBookFormStore.validationError = {
        [filedName]: `The ${filedName} must contain at least ${this.TEXT_FIELD_MIN_LENGTH} and no more than ${this.TEXT_FIELD_MAX_LENGTH} characters`,
      };
    } else {
      this.createBookFormStore.validationError = {
        [filedName]: undefined,
      };
    }
  }

  toggleFormMode() {
    if (this.createBookFormStore.isCreateMode) {
      this.createBookFormStore.reset();
    } else {
      this.createBookFormStore.isCreateMode = true;
    }
  }

  changeTitleField(_title: string): void {
    const title = _title.trim();
    this.createBookFormStore.title = title;

    this.validateField(title, "title");
  }

  changeAuthorField(_author: string): void {
    const author = _author.trim();
    this.createBookFormStore.author = author;

    this.validateField(author, "author");
  }

  async changeFilterView(view: BookFilter["view"]) {
    this.bookStore.filter = { view: view };
    await this.loadBooks();
  }

  async loadBooks(): Promise<void> {
    this.bookStore.isPending = true;
    this.bookStore.error = null;

    try {
      let books: BookDto[];

      if (this.bookStore.filter.view === "all") {
        books = await this.bookGateway.getBooks();
      } else {
        books = await this.bookGateway.getPrivateBooks();
      }

      this.bookStore.books = books;
    } catch (err) {
      this.bookStore.error = (err as Error).message;
    } finally {
      if (!this.bookStore.isLoaded) {
        this.bookStore.isLoaded = true;
      }

      this.bookStore.isPending = false;
    }
  }

  async createBook(): Promise<void> {
    this.createBookFormStore.isSubmitting = true;
    this.bookStore.error = null;

    try {
      await this.bookGateway.createBook({
        ownerId: API_CONFIG.USER_NAME,
        author: this.createBookFormStore.author,
        name: this.createBookFormStore.title,
      });

      this.createBookFormStore.reset();

      await this.loadBooks();
    } catch (err) {
      this.bookStore.error = (err as Error).message;
      this.createBookFormStore.isSubmitting = false;
    }
  }

  destroy() {
    this.bookStore.reset();
    this.createBookFormStore.reset();
  }
}
