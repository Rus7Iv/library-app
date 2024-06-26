"use client";

import { useState, useEffect } from 'react';
import { Book } from '@/utils/types';
import { BookCard } from '@/components/BookCard';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchBooks } from '@/api/api';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const data = await fetchBooks(page);
        setBooks(data.books);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
      setLoading(false);
    };

    loadBooks();
  }, [page]);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  };

  return (
    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
      {loading ? (
        <LoadingSpinner />
      ) : books.length === 0 ? (
        <h2 className="text-xl font-bold mb-4 text-center">Книги не найдены</h2>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard book={book} key={book.id}/>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  );
};

export default Books;
