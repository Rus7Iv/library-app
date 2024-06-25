"use client"

interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
  }
  
export const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7 justify-center flex">
      <div className="flex space-x-4">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className={`inline-flex w-[100px] justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${page === 1 ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>Назад</button>
        {pageNumbers.map(number => (
          <button 
            key={number} 
            onClick={() => setPage(number)} 
            className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${page === number ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {number}
          </button>
        ))}
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className={`inline-flex w-[100px] justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${page === totalPages ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>Вперёд</button>
      </div>
    </div>
  );
};
  