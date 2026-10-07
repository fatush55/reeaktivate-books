import { API_CONFIG } from "../configs";

import type { BookDto } from "./types";

export class BookGateway {
  constructor(private readonly userName: string) {}

  async getBooks(): Promise<BookDto[]> {
    const response = await fetch(`${API_CONFIG.API_BASE}/${this.userName}`);

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    return response.json();
  }

  async getPrivateBooks(): Promise<BookDto[]> {
    const response = await fetch(`${API_CONFIG.API_BASE}/${this.userName}/private`);

    if (!response.ok) {
      throw new Error("Failed to fetch private of books");
    }

    return response.json();
  }

  async createBook(book: Omit<BookDto, "id">): Promise<BookDto> {
    const response = await fetch(`${API_CONFIG.API_BASE}/${this.userName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...book, id: crypto.randomUUID() }),
    });

    if (!response.ok) {
      throw new Error("Failed to create book");
    }

    return response.json();
  }
}
