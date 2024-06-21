"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Book {
  id: number;
  cover: string;
  title: string;
  description: string;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`/api/books?page=${page}`);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="p-4 border rounded shadow">
            <Image src={book.cover} alt={book.title} width={500} height={300} className="mb-4"/>
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p>{book.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="mr-2">Previous</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Books;
