"use client"

import { useState } from 'react';
import { Book } from '@/utils/types';
import Image from 'next/image';
import { Modal } from './Modal';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => setHovered(true), 750);
    setTimerId(id);
  };

  const handleMouseLeave = () => {
    if (timerId) window.clearTimeout(timerId);
    setHovered(false);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        key={book.id} 
        className="relative group sm:cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:rounded-xl opacity-0 md:group-hover:opacity-100 transition duration-500 ease-in-out ${hovered ? '-rotate-90 -translate-y-1/3 bg-cyan-400' : 'group-hover:-rotate-6'}`}
          style={{ transformOrigin: 'bottom' }}
        >
          {hovered && (
              <div className="absolute flex inset-0 text-white p-4 w-[210px] h-[180px] overflow-y-auto" style={{ transform: 'translateY(5%) translateX(-5%) rotate(90deg)' }}>
                  <p>{book.description}</p>
              </div>
          )}
        </div>
        <div className="relative p-4 border rounded-xl shadow bg-white h-[300px]">
          <Image src={`/api/covers/${book.cover}`} alt={book.title} className="mb-4 h-[150px] object-cover" width={500} height={200} priority />
          <h2 className="text-xl font-bold w-full text-center overflow-hidden text-ellipsis line-clamp-2 h-[60px]">{book.title}</h2>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
            <Image src={`/api/covers/${book.cover}`} alt={book.title} className="mb-4 h-[150px] object-cover" width={500} height={200} priority />
            <h2 className="text-xl font-bold mb-4">{book.title}</h2>
            <p>{book.description}</p>
        </Modal>
      )}
    </>
  );
};