"use client"

import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7 justify-center flex">
      <div className="flex flex-col md:flex-row sm:space-x-4 w-full">
        <div className="flex space-x-4 justify-center mb-4 md:mb-0">
          {pageNumbers.map((number, index) => (
            <React.Fragment key={number}>
              {index > 0 && pageNumbers[index - 1] < number - 1 && <div>...</div>}
              <button
                key={number}
                onClick={() => setPage(number)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  page === number ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {number}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`inline-flex w-[100px] justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              page === 1 ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            Назад
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`inline-flex w-[100px] justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              page === totalPages ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            Вперёд
          </button>
        </div>
      </div>
    </div>
  );
};

  