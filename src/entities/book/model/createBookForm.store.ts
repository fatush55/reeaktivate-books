import { makeAutoObservable } from "mobx";

import type { CreateBookValidationError } from "./types";

export class CreateBookFormStore {
  private _isCreateMode = false;
  private _title = "";
  private _author = "";
  private _validationError: CreateBookValidationError | null = null;
  private _isSubmitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isCreateMode(): boolean {
    return this._isCreateMode;
  }

  set isCreateMode(mode: boolean) {
    this._isCreateMode = mode;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get author(): string {
    return this._author;
  }

  set author(value: string) {
    this._author = value;
  }

  get validationError(): CreateBookValidationError | null {
    return this._validationError;
  }

  set validationError(error: CreateBookValidationError | null) {
    if (!error) {
      this._validationError = null;
    } else if (!this._validationError) {
      this._validationError = error;
    } else {
      this._validationError = { ...this._validationError, ...error };
    }
  }

  get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  set isSubmitting(value: boolean) {
    this._isSubmitting = value;
  }

  get isValidForm() {
    if (!this._title.length || !this._author.length) {
      return false;
    }

    if (!this._validationError) {
      return true;
    }

    return !this._validationError.title && !this._validationError.author;
  }

  reset(): void {
    this._isCreateMode = false;
    this._title = "";
    this._author = "";
    this._validationError = null;
    this._isSubmitting = false;
  }
}
