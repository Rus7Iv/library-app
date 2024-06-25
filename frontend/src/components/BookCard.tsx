"use client"

import { useState } from 'react';
import { Book } from '@/utils/types';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => setHovered(true), 750);
    setTimerId(id);
  };

  const handleMouseLeave = () => {
    if (timerId) window.clearTimeout(timerId);
    setHovered(false);
  };

  return (
    <div 
      key={book.id} 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out ${hovered ? '-rotate-90 -translate-y-1/4 bg-cyan-400' : 'group-hover:-rotate-6'}`}
        style={{ transformOrigin: 'bottom' }}
      >
        {hovered && <p className="absolute inset-0 text-white p-4 rotate-90 -translate-x-1/2 -translate-y-1 w-[250px]">{book.description}</p>}
      </div>
      <div className="relative p-4 border rounded-xl shadow bg-white h-[300px]">
        <Image src={`/api/covers/${book.cover}`} alt={book.title} width={500} height={100} className="mb-4" priority style={{ maxHeight: '150px', objectFit: 'cover' }}/>
        <h2 className="text-xl font-bold">{book.title}</h2>
      </div>
    </div>
  );
};
