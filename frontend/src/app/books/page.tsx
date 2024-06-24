"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface Book {
  id: string;
  cover: string;
  title: string;
  description: string;
}

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
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
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
                        <div key={book.id} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 group-hover:-rotate-6 sm:rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out"></div>
                          <div className="relative z-10 p-4 border rounded-xl shadow bg-white">
                            <Image src={`/api/covers/${book.cover}`} alt={book.title} width={500} height={100} className="mb-4" priority/>
                            <h2 className="text-xl font-bold">{book.title}</h2>
                            <p>{book.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7 justify-center flex">
                      <div className="flex space-x-4">
                        <button onClick={() => setPage(page - 1)} disabled={page === 1} className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${page === 1 ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>Previous</button>
                        {pageNumbers.map(number => (
                          <button 
                            key={number} 
                            onClick={() => setPage(number)} 
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${page === number ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                          >
                            {number}
                          </button>
                        ))}
                        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${page === totalPages ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>Next</button>
                      </div>
                    </div>
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
