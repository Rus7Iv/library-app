"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

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
    <main className="flex min-h-screen flex-col items-center justify-between p-20">
      {loading ? (
        <div className="spinner">Loading...</div>
      ) : books.length === 0 ? (
        <div className="message">No books found</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {books.map((book) => (
              <div key={book.id} className="p-4 border rounded shadow">
                <Image src={`/api/covers/${book.cover}`} alt={book.title} width={500} height={300} className="mb-4" priority/>
                <h2 className="text-xl font-bold">{book.title}</h2>
                <p>{book.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="mr-2">Previous</button>
            {pageNumbers.map(number => (
              <button 
                key={number} 
                onClick={() => setPage(number)} 
                className={`mr-2 ${page === number ? 'font-bold' : ''}`}
              >
                {number}
              </button>
            ))}
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}
    </main>
  );
};

export default Books;
