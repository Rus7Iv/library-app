import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl md:block hidden" />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <Image src='/logo.svg' alt='logo' width={100} height={100} priority/>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>Добро пожаловать в наше приложение для книг!</p>
                <p>Вы можете просмотреть список книг или добавить новую книгу.</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
