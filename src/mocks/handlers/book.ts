import { API_CONFIG } from "@entities/book/configs";
import { http, HttpResponse } from "msw";

import type { BookDto } from "@entities/book/api";

export const mockBooksList: BookDto[] = [
  { id: "1", name: "Clean Code", author: "Robert Martin", ownerId: "other-user" },
  { id: "2", name: "Refactoring", author: "Martin Fowler", ownerId: API_CONFIG.USER_NAME },
];

export const handlersBook = [
  /**@info GET /v1/books/:userName */
  http.get(`${API_CONFIG.API_BASE}/:userName`, () => {
    return HttpResponse.json(mockBooksList);
  }),

  /**@info GET /v1/books/:userName/private */
  http.get(`${API_CONFIG.API_BASE}/:userName/private`, () => {
    return HttpResponse.json([mockBooksList[1]]);
  }),

  /**@info POST /v1/books/:userName */
  http.post(`${API_CONFIG.API_BASE}/:userName`, async () => {
    return HttpResponse.json({ status: "ok" }, { status: 201 });
  }),
];
