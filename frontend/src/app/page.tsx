import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
        <p>Добро пожаловать!</p>
        <p>Здесь вы можете просмотретьсписок книг<br/>или добавить новую книгу.</p>
      </div>
      <div className="pt-6 text-base leading-6 space-y-4 font-bold sm:text-lg sm:leading-7">
        <p>Что вы хотите сделать?</p>
        <div className="flex sm:flex-row flex-col justify-between">
          <Link href="/books" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 mb-4 sm:mb-0">
              Просмотреть книги
          </Link>
          <Link href="/books/create" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
              Добавить книгу
          </Link>
        </div>
      </div>   
    </>
  )
}
