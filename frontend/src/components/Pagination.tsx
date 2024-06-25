"use client"

import React from "react";

interface IPaginationProps {
  page: number;
  totalPages?: number;
  setPage: (page: number) => void;
}

const BackButton = ({ page, setPage }: IPaginationProps) => (
  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
    className={`inline-flex w-[100px] justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
      page === 1 ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
    }`}
  >
    Назад
  </button>
);

const PageList = ({ page, totalPages, setPage }: IPaginationProps) => {
  const pageNumbers: number[] = [];
  if (totalPages) {
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pageNumbers.push(i);
      }
    }
  }

  return (
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
  );
};

const ForwardButton = ({ page, totalPages, setPage }: IPaginationProps) => (
  <button
    onClick={() => setPage(page + 1)}
    disabled={page === totalPages}
    className={`inline-flex w-[100px] justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
      page === totalPages ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
    }`}
  >
    Вперёд
  </button>
);

export const Pagination = ({ page, totalPages, setPage }: IPaginationProps) => (
  <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7 justify-center flex">
    <div className="flex-row space-x-4 w-full hidden md:flex justify-center">
      <BackButton page={page} setPage={setPage} />
      <PageList page={page} totalPages={totalPages} setPage={setPage} />
      <ForwardButton page={page} totalPages={totalPages} setPage={setPage} />
    </div>
    <div className="flex flex-col w-full md:hidden">
      <PageList page={page} totalPages={totalPages} setPage={setPage} />
      <div className="flex space-x-4 w-full justify-center">
        <BackButton page={page} setPage={setPage} />
        <ForwardButton page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  </div>
);