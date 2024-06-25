"use client"

import { Book } from '@/utils/types';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
}
export const BookCard = ({ book }: BookCardProps) => {
    return (
      <div key={book.id} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 group-hover:-rotate-6 sm:rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out"></div>
        <div className="relative z-10 p-4 border rounded-xl shadow bg-white" style={{ minHeight: '300px' }}>
          <Image src={`/api/covers/${book.cover}`} alt={book.title} width={500} height={100} className="mb-4" priority style={{ maxHeight: '150px', objectFit: 'cover' }}/>
          <h2 className="text-xl font-bold">{book.title}</h2>
          <p>{book.description}</p>
        </div>
      </div>
    );
  };
  