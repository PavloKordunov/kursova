"use client";

import { useEffect, useState } from "react";
import { bookApi, Book } from "@/lib/api";
import AddBookModal from "@/components/AddBookModal";

type SortField = "author" | "year" | "id" | "";
type SortDir = "asc" | "desc";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [currentSortBy, setCurrentSortBy] = useState<SortField>("");
  const [currentSortDir, setCurrentSortDir] = useState<SortDir>("asc");

  const fetchBooks = async (
    sortBy: SortField = "",
    sortDir: SortDir = "asc",
  ) => {
    setIsLoading(true);
    try {
      const data = await bookApi.getBooks(sortBy, sortDir);
      setBooks(data);
    } catch (error) {
      console.error("Помилка завантаження книг:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSort = (field: SortField) => {
    let newDir: SortDir = "asc";
    if (currentSortBy === field) {
      newDir = currentSortDir === "asc" ? "desc" : "asc";
    }
    setCurrentSortBy(field);
    setCurrentSortDir(newDir);
    fetchBooks(field, newDir);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Дійсно списати цю книгу?")) return;
    try {
      await bookApi.deleteBook(id);
      fetchBooks(currentSortBy, currentSortDir);
    } catch (error) {
      console.error("Помилка при видаленні:", error);
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (currentSortBy !== field) {
      return (
        <svg
          className="w-4 h-4 text-gray-400 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return currentSortDir === "asc" ? (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 font-sans text-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="bg-blue-600 text-white p-2 rounded-xl">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </span>
              LibraryHub
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Система управління бібліотечним фондом
            </p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Додати книгу
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-5 w-24">ID</th>
                  <th className="p-5">
                    <button
                      onClick={() => handleSort("author")}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
                    >
                      АВТОР {renderSortIcon("author")}
                    </button>
                  </th>
                  <th className="p-5">НАЗВА</th>
                  <th className="p-5">
                    <button
                      onClick={() => handleSort("year")}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
                    >
                      РІК {renderSortIcon("year")}
                    </button>
                  </th>
                  <th className="p-5 text-right">ЕКЗЕМПЛЯРИ</th>
                  <th className="p-5 text-center w-24">ДІЇ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      <div className="flex justify-center items-center gap-3">
                        <svg
                          className="animate-spin h-5 w-5 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Завантаження бази...
                      </div>
                    </td>
                  </tr>
                ) : books.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-16 h-16 text-slate-300 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <p className="text-lg font-medium text-slate-600">
                          Бібліотека порожня
                        </p>
                        <p className="mt-1">
                          Натисніть «Додати книгу», щоб почати наповнення.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  books.map((book, index) => (
                    <tr
                      key={book.id}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="p-5">
                        <span className="bg-slate-100 text-slate-600 font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200">
                          {String(index + 1)}
                        </span>
                      </td>

                      <td className="p-5 font-bold text-slate-800">
                        {book.authorLastName} {book.authorInitials}
                      </td>
                      <td className="p-5 text-slate-600">{book.title}</td>
                      <td className="p-5 text-slate-500">
                        {book.publicationYear}
                      </td>

                      <td className="p-5 text-right">
                        <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                          {book.copiesCount} шт.
                        </span>
                      </td>

                      <td className="p-5 text-center flex items-center justify-center gap-2">
                        <button
                          onClick={() => book.id && handleDelete(book.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-50 group-hover:opacity-100"
                          title="Списати книгу"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setOpenModal(true);
                            setEditingBook(book);
                          }}
                          className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all opacity-50 group-hover:opacity-100"
                          title="редагувати книгу"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openModal && (
        <AddBookModal
          close={() => setOpenModal(false)}
          editingBook={editingBook}
          fetchBooks={() => fetchBooks(currentSortBy, currentSortDir)}
        />
      )}
    </main>
  );
}
