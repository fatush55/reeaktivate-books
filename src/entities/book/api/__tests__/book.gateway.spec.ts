import { mockBooksList } from "@mocks/handlers";
import { server } from "@mocks/server";
import { http, HttpResponse } from "msw";

import { API_CONFIG } from "../../configs";
import { BookGateway } from "../book.gateway";

describe("BookGateway", () => {
  let gateway: BookGateway;

  beforeEach(() => {
    gateway = new BookGateway(API_CONFIG.USER_NAME);
  });

  describe("getBooks", () => {
    it("should fetch all books successfully", async () => {
      const books = await gateway.getBooks();

      expect(books).toEqual(mockBooksList);
      expect(books).toHaveLength(2);
    });

    it("should throw error when server response is not ok", async () => {
      server.use(
        http.get(`${API_CONFIG.API_BASE}/${API_CONFIG.USER_NAME}`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(gateway.getBooks()).rejects.toThrow("Failed to fetch books");
    });
  });

  describe("getPrivateBooks", () => {
    it("should fetch private books successfully", async () => {
      const books = await gateway.getPrivateBooks();

      expect(books).toEqual([mockBooksList[1]]);
      expect(books).toHaveLength(1);
    });

    it("should throw error when private books request fails", async () => {
      server.use(
        http.get(`${API_CONFIG.API_BASE}/${API_CONFIG.USER_NAME}/private`, () => {
          return new HttpResponse(null, { status: 403 });
        })
      );

      await expect(gateway.getPrivateBooks()).rejects.toThrow("Failed to fetch private of books");
    });
  });

  describe("createBook", () => {
    it("should create book with generated UUID and return created payload", async () => {
      const payload = {
        name: "Domain-Driven Design",
        author: "Eric Evans",
        ownerId: API_CONFIG.USER_NAME,
      };

      const result = await gateway.createBook(payload);

      expect(result).toEqual({
        status: "ok",
      });
    });

    it("should throw error when book creation fails", async () => {
      server.use(
        http.post(`${API_CONFIG.API_BASE}/${API_CONFIG.USER_NAME}`, () => {
          return new HttpResponse(null, { status: 400 });
        })
      );

      await expect(
        gateway.createBook({
          name: "Invalid Book",
          author: "Author",
          ownerId: API_CONFIG.USER_NAME,
        })
      ).rejects.toThrow("Failed to create book");
    });
  });
});
