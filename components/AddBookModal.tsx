import { bookApi } from "@/lib/api";
import { useState } from "react";

const AddBookModal = ({
  close,
  fetchBooks,
  editingBook,
  setEditingBook,
}: {
  close: () => void;
  fetchBooks: () => void;
  editingBook?: any;
  setEditingBook: (book: any) => void;
}) => {
  const [bookData, setBookData] = useState({
    authorLastName: editingBook ? editingBook.authorLastName : "",
    authorInitials: editingBook ? editingBook.authorInitials : "",
    title: editingBook ? editingBook.title : "",
    publicationYear: editingBook ? editingBook.publicationYear.toString() : "",
    copiesCount: editingBook ? editingBook.copiesCount.toString() : "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !bookData.authorLastName ||
        !bookData.authorInitials ||
        !bookData.title ||
        !bookData.publicationYear ||
        !bookData.copiesCount
      ) {
        alert("Будь ласка, заповніть всі поля!");
        return;
      }

      await bookApi.addBook({
        ...bookData,
        publicationYear: Number(bookData.publicationYear),
        copiesCount: Number(bookData.copiesCount),
      });

      await fetchBooks();
      setBookData({
        authorLastName: "",
        authorInitials: "",
        title: "",
        publicationYear: "",
        copiesCount: "",
      });
      setEditingBook(undefined);
      close();
    } catch (error) {
      console.log("Помилка при додаванні книги:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (
        !bookData.authorLastName ||
        !bookData.authorInitials ||
        !bookData.title ||
        !bookData.publicationYear ||
        !bookData.copiesCount
      ) {
        alert("Будь ласка, заповніть всі поля!");
        return;
      }

      await bookApi.updateBook(editingBook.id, {
        ...bookData,
        publicationYear: Number(bookData.publicationYear),
        copiesCount: Number(bookData.copiesCount),
      });

      await fetchBooks();
      setBookData({
        authorLastName: "",
        authorInitials: "",
        title: "",
        publicationYear: "",
        copiesCount: "",
      });
      setEditingBook(undefined);
      close();
    } catch (error) {
      console.log("Помилка при оновленні книги:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm p-4 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {editingBook ? "Редагувати книгу" : "Нова книга"}
          </h2>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назва книги
            </label>
            <input
              type="text"
              name="title"
              placeholder="Напр. Гаррі Поттер і філософський камінь"
              value={bookData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 hover:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Прізвище автора
              </label>
              <input
                type="text"
                name="authorLastName"
                placeholder="Роулінг"
                value={bookData.authorLastName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-gray-50 hover:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ініціали
              </label>
              <input
                type="text"
                name="authorInitials"
                placeholder="Дж. К."
                value={bookData.authorInitials}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Рік видання
              </label>
              <input
                type="number"
                name="publicationYear"
                placeholder="2001"
                value={bookData.publicationYear}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-gray-50 hover:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Кількість (шт.)
              </label>
              <input
                type="number"
                name="copiesCount"
                placeholder="10"
                value={bookData.copiesCount}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-gray-50 hover:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            onClick={close}
            className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={editingBook ? handleUpdate : handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            Зберегти книгу
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
