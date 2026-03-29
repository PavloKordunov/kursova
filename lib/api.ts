// src/lib/api.ts
const API_URL = "http://localhost:8080/api/v1/books";

export interface Book {
  id?: number;
  authorLastName: string;
  authorInitials: string;
  title: string;
  publicationYear: number;
  copiesCount: number;
}

export const bookApi = {
  // Отримати всі книги (з можливістю сортування)
  getBooks: async (sortBy: "author" | "year" | "" = ""): Promise<Book[]> => {
    const url = sortBy ? `${API_URL}?sortBy=${sortBy}` : API_URL;
    const res = await fetch(url, { cache: "no-store" });
    return res.json();
  },

  // Додати книгу
  addBook: async (book: Book): Promise<Book> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    return res.json();
  },

  // Видалити книгу
  deleteBook: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};
