import { CreateBookFormStore } from "../createBookForm.store";

describe("CreateBookFormStore", () => {
  let store: CreateBookFormStore;

  beforeEach(() => {
    store = new CreateBookFormStore();
  });

  it("should initialize with default state", () => {
    expect(store.isCreateMode).toBe(false);
    expect(store.title).toBe("");
    expect(store.author).toBe("");
    expect(store.validationError).toBeNull();
    expect(store.isSubmitting).toBe(false);
    expect(store.isValidForm).toBe(false);
  });

  describe("getters and setters", () => {
    it("should update isCreateMode", () => {
      store.isCreateMode = true;
      expect(store.isCreateMode).toBe(true);
    });

    it("should update title", () => {
      store.title = "Refactoring";
      expect(store.title).toBe("Refactoring");
    });

    it("should update author", () => {
      store.author = "Martin Fowler";
      expect(store.author).toBe("Martin Fowler");
    });

    it("should update isSubmitting", () => {
      store.isSubmitting = true;
      expect(store.isSubmitting).toBe(true);
    });
  });

  describe("validationError setter logic", () => {
    it("should set validation error when previously null", () => {
      store.validationError = { title: "Title is too short" };

      expect(store.validationError).toEqual({
        title: "Title is too short",
      });
    });

    it("should merge new validation error with existing error", () => {
      store.validationError = { title: "Title is too short" };
      store.validationError = { author: "Author is required" };

      expect(store.validationError).toEqual({
        title: "Title is too short",
        author: "Author is required",
      });
    });

    it("should clear validation error when set to null", () => {
      store.validationError = { title: "Title error" };
      store.validationError = null;

      expect(store.validationError).toBeNull();
    });
  });

  describe("isValidForm computed getter", () => {
    it("should return false if both title and author are empty", () => {
      expect(store.isValidForm).toBe(false);
    });

    it("should return false if title is empty but author is provided", () => {
      store.author = "Martin Fowler";
      expect(store.isValidForm).toBe(false);
    });

    it("should return false if title is provided but author is empty", () => {
      store.title = "Refactoring";
      expect(store.isValidForm).toBe(false);
    });

    it("should return true if title and author are provided and validationError is null", () => {
      store.title = "Refactoring";
      store.author = "Martin Fowler";

      expect(store.isValidForm).toBe(true);
    });

    it("should return false when title validation error is present", () => {
      store.title = "Re";
      store.author = "Martin Fowler";
      store.validationError = { title: "Title error" };

      expect(store.isValidForm).toBe(false);
    });

    it("should return false when author validation error is present", () => {
      store.title = "Refactoring";
      store.author = "Ma";
      store.validationError = { author: "Author error" };

      expect(store.isValidForm).toBe(false);
    });
  });

  describe("reset method", () => {
    it("should reset all store properties to initial state", () => {
      store.isCreateMode = true;
      store.title = "Clean Code";
      store.author = "Uncle Bob";
      store.validationError = { title: "Error" };
      store.isSubmitting = true;

      store.reset();

      expect(store.isCreateMode).toBe(false);
      expect(store.title).toBe("");
      expect(store.author).toBe("");
      expect(store.validationError).toBeNull();
      expect(store.isSubmitting).toBe(false);
      expect(store.isValidForm).toBe(false);
    });
  });
});
