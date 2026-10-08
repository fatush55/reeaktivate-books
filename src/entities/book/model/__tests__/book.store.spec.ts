import { API_CONFIG } from "../../configs";
import { BookStore } from "../book.store";

import type { BookDto } from "../../api";

describe("BookStore", () => {
  let store: BookStore;

  const publicBook: BookDto = {
    id: "1",
    name: "Public Book",
    author: "Author 1",
    ownerId: "other-user",
  };

  const privateBook: BookDto = {
    id: "2",
    name: "Private Book",
    author: "Author 2",
    ownerId: API_CONFIG.USER_NAME,
  };

  beforeEach(() => {
    store = new BookStore();
  });

  it("should initialize with default state", () => {
    expect(store.books).toEqual([]);
    expect(store.filter).toEqual({ view: "all" });
    expect(store.isLoaded).toBe(false);
    expect(store.isPending).toBe(false);
    expect(store.error).toBeNull();
  });

  describe("getters and setters", () => {
    it("should set and get books correctly", () => {
      store.books = [publicBook, privateBook];

      expect(store.books).toHaveLength(2);
      expect(store.books).toEqual([publicBook, privateBook]);
    });

    it("should merge filter object on setter call", () => {
      store.filter = { view: "private" };

      expect(store.filter).toEqual({ view: "private" });
    });

    it("should set and get isLoaded status", () => {
      store.isLoaded = true;

      expect(store.isLoaded).toBe(true);
    });

    it("should set and get isPending status", () => {
      store.isPending = true;

      expect(store.isPending).toBe(true);
    });

    it("should set and get error message", () => {
      store.error = "Failed to load data";

      expect(store.error).toBe("Failed to load data");
    });
  });

  describe("privateBooksCount computed getter", () => {
    it("should return total books length when filter view is 'private'", () => {
      store.books = [privateBook, privateBook];
      store.filter = { view: "private" };

      expect(store.privateBooksCount).toBe(2);
    });

    it("should calculate private books by ownerId when filter view is 'all'", () => {
      store.books = [publicBook, privateBook, publicBook];
      store.filter = { view: "all" };

      expect(store.privateBooksCount).toBe(1);
    });

    it("should return 0 when no books match private criteria", () => {
      store.books = [publicBook, publicBook];
      store.filter = { view: "all" };

      expect(store.privateBooksCount).toBe(0);
    });
  });

  describe("reset method", () => {
    it("should restore state to default values", () => {
      store.books = [publicBook, privateBook];
      store.isLoaded = true;
      store.isPending = true;
      store.error = "Error";
      store.filter = { view: "private" };

      store.reset();

      expect(store.books).toEqual([]);
      expect(store.isLoaded).toBe(false);
      expect(store.isPending).toBe(false);
      expect(store.error).toBeNull();
      expect(store.filter).toEqual({ view: "all" });
    });
  });
});
