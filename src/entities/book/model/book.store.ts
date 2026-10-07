import { makeAutoObservable } from "mobx";

import { getIsPrivateBook } from "../utils";

import type { BookDto } from "../api";
import type { BookFilter } from "./types";

export class BookStore {
  private _books: BookDto[] = [];
  private _filter: BookFilter = {
    view: "all",
  };
  private _isLoaded = false;
  private _isPending = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  set books(books: BookDto[]) {
    this._books = books;
  }

  get books(): BookDto[] {
    return this._books;
  }

  set filter(filter: BookFilter) {
    this._filter = { ...this._filter, ...filter };
  }

  get filter(): BookFilter {
    return this._filter;
  }

  set isLoaded(loading: boolean) {
    this._isLoaded = loading;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  set isPending(pending: boolean) {
    this._isPending = pending;
  }

  get isPending(): boolean {
    return this._isPending;
  }

  set error(error: string | null) {
    this._error = error;
  }

  get error(): string | null {
    return this._error;
  }

  get privateBooksCount(): number {
    if (this._filter.view === "private") {
      return this._books.length;
    }

    return this._books.filter((book) => getIsPrivateBook(book.ownerId)).length;
  }

  reset() {
    this._books = [];
    this._isLoaded = false;
    this._isPending = false;
    this._error = null;
    this._filter = {
      view: "all",
    };
  }
}
