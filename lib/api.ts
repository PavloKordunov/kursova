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
  getBooks: async (
    sortBy: "author" | "year" | "id" | "" = "",
    sortDir: "asc" | "desc" = "asc",
  ): Promise<Book[]> => {
    const queryParams = new URLSearchParams();
    if (sortBy) queryParams.append("sortBy", sortBy);
    queryParams.append("sortDir", sortDir);

    const url = `${API_URL}?${queryParams.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    return res.json();
  },

  addBook: async (book: Book): Promise<Book> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    return res.json();
  },

  updateBook: async (id: number, book: Book): Promise<Book> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    return res.json();
  },

  deleteBook: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  },
};
