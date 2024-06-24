"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const coverRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('book', JSON.stringify({ title, description }));
    if (coverRef.current && coverRef.current.files && coverRef.current.files[0]) {
      formData.append('cover', coverRef.current.files[0]);
    }

    try {
      const response = await axios.post('/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        alert('Book created successfully');
        setTitle('');
        setDescription('');
        if (coverRef.current) {
          coverRef.current.value = '';
        }
      } else {
        alert('Error creating book');
      }
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <Image src='/logo.svg' alt='logo' width={100} height={100} priority/>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2">Заголовок</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Описание</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      className="w-full p-2 border rounded resize-none"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Обложка книги</label>
                    <input 
                      type="file" 
                      ref={coverRef} 
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <button type="submit" className="inline-flex w-full items-center px-4 py-2 border border-transparent text-base font-medium hadow-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Добавить книгу</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBook;
