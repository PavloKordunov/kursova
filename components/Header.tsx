"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Book } from "@/lib/api";

export default function Header() {
  const [cart, setCart] = useState<Book[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const loadCart = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  };

  useEffect(() => {
    loadCart();

    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const removeFromCart = (indexToRemove: number) => {
    const newCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const cartTotal = cart.reduce((sum, book) => sum + (book.price || 0), 0);

  const handleCheckout = async () => {
    const customerInfo = prompt(
      "Для оформлення замовлення, будь ласка, введіть ваше Ім'я та Телефон:",
    );
    if (!customerInfo) return; // Відміна

    setIsOrdering(true);
    try {
      const itemsSummary = cart
        .map((b) => `- ${b.title} ($${b.price})`)
        .join("\n");

      const response = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo,
          itemsSummary,
          totalAmount: cartTotal,
          bookIds: cart.map((b) => b.id),
        }),
      });

      if (!response.ok) throw new Error("Помилка сервера");

      alert("🎉 Ваше замовлення успішно оформлено! Дякуємо за покупку.");
      setCart([]);
      localStorage.removeItem("cart");
      setIsCartOpen(false);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      alert("Сталася помилка при оформленні. Перевірте з'єднання з сервером.");
      console.error(error);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <>
      <header className="container mx-auto max-w-6xl p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-tight text-gray-900 hover:text-blue-600 transition-colors"
          >
            Книжкова Вітрина
          </Link>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Адмінка
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-md"
            >
              Кошик
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Модальне вікно кошика (Sidebar) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
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
                <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                  <span className="text-4xl mb-4">🛒</span>
                  Кошик порожній. Час щось обрати!
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          Фото
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-lg font-black mt-1 text-green-700">
                        ${item.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors hover:border-red-500 shadow-sm"
                    >
                      🗑
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">
                  Разом до сплати:
                </span>
                <span className="text-3xl font-black text-gray-900">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <button
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2"
                disabled={cart.length === 0 || isOrdering}
                onClick={handleCheckout}
              >
                {isOrdering ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    Обробка...
                  </>
                ) : (
                  "Оформити замовлення"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
