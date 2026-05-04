"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bookApi, Book } from "@/lib/api";

type SortField = "author" | "year" | "id" | "";
type SortDir = "asc" | "desc";

export default function StorefrontPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Book[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchBooks = async (sortF: SortField = "", sortD: SortDir = "asc") => {
    setIsLoading(true);
    try {
      const data = await bookApi.getBooks(sortF, sortD);
      setBooks(data);
    } catch (error) {
      console.error("Помилка завантаження книг:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(sortBy, "asc");
  }, [sortBy]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authorLastName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddToCart = (e: React.MouseEvent, bookToAdd: Book) => {
    e.preventDefault();
    const savedCart = localStorage.getItem("cart");
    const currentCart = savedCart ? JSON.parse(savedCart) : [];

    currentCart.push(bookToAdd);
    localStorage.setItem("cart", JSON.stringify(currentCart));

    window.dispatchEvent(new Event("cartUpdated"));

    alert(`✅ Товар "${bookToAdd.title}" додано до кошика!`);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((sum, book) => sum + (book.price || 0), 0);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-medium text-gray-500">
        Завантаження вітрини...
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-6xl p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <input
          type="text"
          placeholder="Пошук за назвою або автором..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortField)}
          className="p-3 rounded-xl border border-gray-200 bg-white min-w-[200px] cursor-pointer focus:outline-none"
        >
          <option value="">Без сортування</option>
          <option value="year">За роком видання</option>
          <option value="author">За автором</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Link href={`/book/${book.id}`} key={book.id} className="group">
              <div className="border border-gray-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white flex flex-col h-full">
                <div className="w-full h-56 bg-gray-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Немає обкладинки
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {book.authorLastName} {book.authorInitials}
                  </p>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-gray-900">
                      ${book.price?.toFixed(2) || "0.00"}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, book)}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
                    >
                      В кошик
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            За вашим запитом нічого не знайдено 😔
          </div>
        )}
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Ваш кошик</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex-grow overflow-y-auto flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  Кошик порожній. Час щось обрати!
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-lg font-black mt-1">
                        ${item.price?.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      🗑
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Разом:</span>
                <span className="text-3xl font-black">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <button
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={cart.length === 0}
                onClick={() => {
                  alert("Перехід до оплати... (Демо)");
                  setCart([]);
                }}
              >
                Оформити замовлення
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
