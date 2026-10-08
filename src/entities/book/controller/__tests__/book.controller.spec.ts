import { API_CONFIG } from "../../configs";
import { BookStore } from "../../model/book.store";
import { CreateBookFormStore } from "../../model/createBookForm.store";
import { BookController } from "../book.controller";

import type { BookGateway, BookDto } from "../../api";
import type { Mocked } from "vitest";

describe("BookController", () => {
  let bookStore: BookStore;
  let formStore: CreateBookFormStore;
  let gateway: Mocked<BookGateway>;
  let controller: BookController;

  const mockBooks: BookDto[] = [
    { id: "1", name: "Clean Architecture", author: "Robert Martin", ownerId: "user-1" },
  ];

  beforeEach(() => {
    bookStore = new BookStore();
    formStore = new CreateBookFormStore();

    gateway = {
      getBooks: vi.fn().mockResolvedValue(mockBooks),
      getPrivateBooks: vi.fn().mockResolvedValue(mockBooks),
      createBook: vi.fn().mockResolvedValue({ ...mockBooks[0] }),
    } as unknown as Mocked<BookGateway>;

    controller = new BookController(bookStore, formStore, gateway);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("toggleFormMode", () => {
    it("should set isCreateMode to true when it is currently false", () => {
      formStore.isCreateMode = false;
      controller.toggleFormMode();

      expect(formStore.isCreateMode).toBe(true);
    });

    it("should reset form store when isCreateMode is already true", () => {
      formStore.isCreateMode = true;
      const resetSpy = vi.spyOn(formStore, "reset");

      controller.toggleFormMode();

      expect(resetSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Validation logic (changeTitleField & changeAuthorField)", () => {
    it("should set 'required' error if value is empty or only whitespaces", () => {
      controller.changeTitleField("   ");
      controller.changeAuthorField("");

      expect(formStore.title).toBe("");
      expect(formStore.author).toBe("");
      expect(formStore.validationError?.title).toBe("The title is required");
      expect(formStore.validationError?.author).toBe("The author is required");
    });

    it("should set length error if value is too short (< 3 chars)", () => {
      controller.changeTitleField("ab");
      controller.changeAuthorField("cd");

      const expectedLengthError = (field: string) =>
        `The ${field} must contain at least 3 and no more than 50 characters`;

      expect(formStore.validationError?.title).toBe(expectedLengthError("title"));
      expect(formStore.validationError?.author).toBe(expectedLengthError("author"));
    });

    it("should set length error if value is too long (> 50 chars)", () => {
      const longString = "a".repeat(51);
      controller.changeTitleField(longString);

      expect(formStore.validationError?.title).toContain(
        "must contain at least 3 and no more than 50 characters"
      );
    });

    it("should clear error (set to undefined) if value is valid", () => {
      formStore.validationError = { title: "Error", author: "Error" };

      controller.changeTitleField("Valid Title");
      controller.changeAuthorField("Valid Author");

      expect(formStore.validationError?.title).toBeUndefined();
      expect(formStore.validationError?.author).toBeUndefined();
    });
  });

  describe("changeFilterView", () => {
    it("should update filter and load books", async () => {
      const loadBooksSpy = vi.spyOn(controller, "loadBooks").mockResolvedValue();

      await controller.changeFilterView("private");

      expect(bookStore.filter).toEqual({ view: "private" });
      expect(loadBooksSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("loadBooks", () => {
    it("should fetch all books and update store when filter view is 'all'", async () => {
      bookStore.filter = { view: "all" };

      await controller.loadBooks();

      expect(bookStore.isPending).toBe(false);
      expect(bookStore.isLoaded).toBe(true);
      expect(bookStore.books).toEqual(mockBooks);
      expect(gateway.getBooks).toHaveBeenCalledTimes(1);
      expect(gateway.getPrivateBooks).not.toHaveBeenCalled();
    });

    it("should fetch private books and update store when filter view is 'private'", async () => {
      bookStore.filter = { view: "private" };
      bookStore.isLoaded = true;

      await controller.loadBooks();

      expect(gateway.getPrivateBooks).toHaveBeenCalledTimes(1);
      expect(gateway.getBooks).not.toHaveBeenCalled();
      expect(bookStore.books).toEqual(mockBooks);
      expect(bookStore.isLoaded).toBe(true);
    });

    it("should handle gateway error correctly during load", async () => {
      gateway.getBooks.mockRejectedValueOnce(new Error("Network Error"));

      await controller.loadBooks();

      expect(bookStore.error).toBe("Network Error");
      expect(bookStore.isPending).toBe(false);
    });
  });

  describe("createBook", () => {
    beforeEach(() => {
      formStore.title = "Refactoring";
      formStore.author = "Martin Fowler";
    });

    it("should successfully create book, reset form, and reload list", async () => {
      let resolveGateway: (
        value:
          | {
              status: string;
            }
          | PromiseLike<{
              status: string;
            }>
      ) => void;

      gateway.createBook.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveGateway = resolve;
        })
      );

      const loadBooksSpy = vi.spyOn(controller, "loadBooks").mockResolvedValue();
      const resetFormSpy = vi.spyOn(formStore, "reset");

      const createPromise = controller.createBook();

      expect(formStore.isSubmitting).toBe(true);

      resolveGateway!({ status: "ok" });
      await createPromise;

      expect(gateway.createBook).toHaveBeenCalledWith({
        ownerId: API_CONFIG.USER_NAME,
        author: "Martin Fowler",
        name: "Refactoring",
      });
      expect(resetFormSpy).toHaveBeenCalledTimes(1);
      expect(loadBooksSpy).toHaveBeenCalledTimes(1);
      expect(bookStore.error).toBeNull();
      expect(formStore.isSubmitting).toBe(false);
    });

    it("should handle error when book creation fails", async () => {
      let rejectGateway: (reason?: unknown) => void;

      gateway.createBook.mockReturnValueOnce(
        new Promise((_, reject) => {
          rejectGateway = reject;
        })
      );

      const loadBooksSpy = vi.spyOn(controller, "loadBooks");

      const createPromise = controller.createBook();

      expect(formStore.isSubmitting).toBe(true);

      rejectGateway!(new Error("Creation Failed"));
      await createPromise;

      expect(bookStore.error).toBe("Creation Failed");
      expect(formStore.isSubmitting).toBe(false);
      expect(loadBooksSpy).not.toHaveBeenCalled();
    });
  });

  describe("destroy", () => {
    it("should reset both bookStore and createBookFormStore", () => {
      const bookStoreResetSpy = vi.spyOn(bookStore, "reset");
      const formStoreResetSpy = vi.spyOn(formStore, "reset");

      controller.destroy();

      expect(bookStoreResetSpy).toHaveBeenCalledTimes(1);
      expect(formStoreResetSpy).toHaveBeenCalledTimes(1);
    });
  });
});
