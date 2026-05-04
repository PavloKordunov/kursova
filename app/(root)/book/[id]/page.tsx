"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { bookApi, Book } from "@/lib/api";

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentBook = await bookApi.getBookById(Number(id));
        setBook(currentBook);

        const allBooks = await bookApi.getBooks();
        const otherBooks = allBooks
          .filter((b) => b.id !== Number(id))
          .slice(0, 4);

        setRecommendations(otherBooks);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent, bookToAdd: Book) => {
    e.preventDefault();
    const savedCart = localStorage.getItem("cart");
    const currentCart = savedCart ? JSON.parse(savedCart) : [];

    currentCart.push(bookToAdd);
    localStorage.setItem("cart", JSON.stringify(currentCart));

    window.dispatchEvent(new Event("cartUpdated"));

    alert(`✅ Товар "${bookToAdd.title}" додано до кошика!`);
  };

  if (isLoading || !book) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-medium text-gray-500">
        Завантаження інформації про товар...
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-6xl p-6">
      <Link
        href="/"
        className="text-blue-600 hover:underline inline-block font-medium transition-colors"
      >
        &larr; Повернутися до вітрини
      </Link>

      <div className="flex flex-col md:flex-row gap-10 bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100 mb-16">
        <div className="w-full md:w-1/2 flex-shrink-0">
          <div className="w-full aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center shadow-inner">
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 font-medium">
                Зображення відсутнє
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center w-full">
          <div className="mb-2 flex items-center justify-between">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              В наявності ({book.copiesCount} шт.)
            </span>
            <span className="text-gray-400 text-sm font-mono">
              ID: {book.id}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            {book.title}
          </h1>

          <p className="text-xl text-gray-500 mb-8 font-medium">
            Автор:{" "}
            <span className="text-gray-800">
              {book.authorLastName} {book.authorInitials}
            </span>
          </p>

          <div className="mb-10">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-black block"></span>
              Опис товару
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {book.description ||
                "Детальний опис для цієї книги ще не додано. Проте ми впевнені, що вона чудова!"}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-4xl font-black text-gray-900 tracking-tight">
              ${book.price?.toFixed(2) || "0.00"}
            </div>
            <button
              onClick={(e) => handleAddToCart(e, book)}
              className="w-full sm:w-auto flex-grow bg-black hover:bg-gray-800 text-white font-bold text-lg py-5 px-8 rounded-2xl transition-all active:scale-95 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex justify-center items-center gap-3"
            >
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Додати до кошика
            </button>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mb-20">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            Вас також може зацікавити
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <Link
                href={`/book/${rec.id}`}
                key={rec.id}
                className="group cursor-pointer"
              >
                <div className="border border-gray-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white h-full flex flex-col">
                  <div className="w-full aspect-[3/4] bg-gray-50 rounded-xl mb-4 overflow-hidden">
                    {rec.image ? (
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-300 text-xs">
                          Немає фото
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm mb-1">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-auto pt-2">
                      {rec.authorLastName} {rec.authorInitials}
                    </p>
                    <div className="mt-2 font-black text-gray-900">
                      ${rec.price?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
