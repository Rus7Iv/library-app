"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Book } from '@/utils/types';
import { BookCard } from '@/components/BookCard';
import { Pagination } from '@/components/Pagination';

interface BooksResponse {
  total_pages: number;
  books: Book[];
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<BooksResponse>(`/api/books?page=${page}`);
        setBooks(response.data.books);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
      setLoading(false);
    };

    fetchBooks();
  }, [page]);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl md:block hidden" />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="mx-auto">
            <div>
              <Image src='/logo.svg' alt='logo' width={100} height={100} priority/>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {loading ? (
                  <div>Loading...</div>
                ) : books.length === 0 ? (
                  <div>No books found</div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
