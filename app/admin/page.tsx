"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bookApi, Book } from "@/lib/api";
import AddBookModal from "@/components/AddBookModal";

type SortField = "author" | "year" | "id" | "";
type SortDir = "asc" | "desc";

interface Order {
  id: number;
  customerInfo: string;
  itemsSummary: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminLibraryPage() {
  const [activeTab, setActiveTab] = useState<"books" | "orders">("books");

  const [books, setBooks] = useState<Book[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [currentSortBy, setCurrentSortBy] = useState<SortField>("");
  const [currentSortDir, setCurrentSortDir] = useState<SortDir>("asc");

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = async (
    sortBy: SortField = currentSortBy,
    sortDir: SortDir = currentSortDir,
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

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Помилка завантаження замовлень:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "books") {
      fetchBooks(currentSortBy, currentSortDir);
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const handleSort = (field: SortField) => {
    let newDir: SortDir = "asc";
    if (currentSortBy === field) {
      newDir = currentSortDir === "asc" ? "desc" : "asc";
    }
    setCurrentSortBy(field);
    setCurrentSortDir(newDir);
    fetchBooks(field, newDir);
  };

  const handleDeleteBook = async (id: number) => {
    if (!confirm("Дійсно видалити цей товар з бази?")) return;
    try {
      await bookApi.deleteBook(id);
      fetchBooks(currentSortBy, currentSortDir);
    } catch (error) {
      console.error("Помилка при видаленні:", error);
    }
  };

  const handleCompleteOrder = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/v1/orders/${id}/complete`, {
        method: "PATCH",
      });
      fetchOrders();
    } catch (error) {
      console.error("Помилка при оновленні статусу:", error);
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
      <div className="max-w-7xl mx-auto px-4 font-sans text-gray-800">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block font-medium"
        >
          &larr; Повернутися до вітрини магазину
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="bg-black text-white p-2 rounded-xl">
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              Панель керування
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Управління товарами та контентом магазину
            </p>
          </div>
          {activeTab === "books" && (
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:-translate-y-0.5"
            >
              + Додати товар
            </button>
          )}
        </div>

        <div className="flex gap-6 mb-6 border-b border-gray-200 pb-px">
          <button
            onClick={() => setActiveTab("books")}
            className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${activeTab === "books" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            📦 Товари
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${activeTab === "orders" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            🛒 Замовлення
            {activeTab !== "orders" &&
              orders.filter((o) => o.status === "Нове").length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Нові
                </span>
              )}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center text-slate-500 flex justify-center items-center gap-3">
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
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
                Завантаження даних...
              </div>
            ) : activeTab === "books" ? (
              // ТАБЛИЦЯ ТОВАРІВ (З твоєю логікою сортування)
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-5 w-16">ID</th>
                    <th className="p-5 w-20">ФОТО</th>
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
                    <th className="p-5">ЦІНА</th>
                    <th className="p-5 text-right">ЗАЛИШОК</th>
                    <th className="p-5 text-center w-24">ДІЇ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {books.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-12 text-center text-slate-400"
                      >
                        Товарів ще немає
                      </td>
                    </tr>
                  )}
                  {books.map((book, index) => (
                    <tr
                      key={book.id}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="p-5">
                        <span className="bg-slate-100 text-slate-600 font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200">
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-200">
                          {book.image ? (
                            <img
                              src={book.image}
                              alt="cover"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">
                              Немає
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 font-bold text-slate-800">
                        {book.authorLastName} {book.authorInitials}
                      </td>
                      <td className="p-5 text-slate-600 font-medium max-w-[200px] truncate">
                        {book.title}
                      </td>
                      <td className="p-5 text-slate-500">
                        {book.publicationYear}
                      </td>
                      <td className="p-5 font-black text-slate-900">
                        ${book.price?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-5 text-right">
                        <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                          {book.copiesCount} шт.
                        </span>
                      </td>
                      <td className="p-5 text-center flex items-center justify-center gap-2 mt-1">
                        <button
                          onClick={() => book.id && handleDeleteBook(book.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => {
                            setOpenModal(true);
                            setEditingBook(book);
                          }}
                          className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-5">ДАТА / ID</th>
                    <th className="p-5">КЛІЄНТ</th>
                    <th className="p-5">ТОВАРИ</th>
                    <th className="p-5">СУМА</th>
                    <th className="p-5 text-center">СТАТУС</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-12 text-center text-gray-500"
                      >
                        Замовлень ще немає
                      </td>
                    </tr>
                  )}
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="p-5 text-gray-500">
                        <div className="font-black text-black">#{order.id}</div>
                        <div className="text-xs mt-1">
                          {new Date(order.createdAt).toLocaleString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="p-5 font-medium">{order.customerInfo}</td>
                      <td className="p-5 text-gray-600 whitespace-pre-wrap text-xs leading-relaxed max-w-[300px]">
                        {order.itemsSummary}
                      </td>
                      <td className="p-5 font-black text-lg text-green-700">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="p-5 text-center">
                        {order.status === "Нове" ? (
                          <button
                            onClick={() => handleCompleteOrder(order.id)}
                            className="bg-black text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-gray-800 transition-colors shadow-md"
                          >
                            Підтвердити
                          </button>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1">
                            Виконано ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {openModal && (
        <AddBookModal
          close={() => {
            setOpenModal(false);
            setEditingBook(null);
          }}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          fetchBooks={() => fetchBooks(currentSortBy, currentSortDir)}
        />
      )}
    </main>
  );
}
