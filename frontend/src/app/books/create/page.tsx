"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { PlusIcon } from '@/assets/PlusIcon'

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const coverRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

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
        setImagePreview('');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = loadEvent => {
        if (loadEvent.target) {
          const base64Image = loadEvent.target.result as string
          setImagePreview(base64Image)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImagePreview('');
    if (coverRef.current) {
      coverRef.current.value = '';
    }
  }  

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = loadEvent => {
        if (loadEvent.target) {
          const base64Image = loadEvent.target.result as string
          setImagePreview(base64Image)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl md:block hidden" />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="sm:w-[400px] mx-auto">
            <div>
              <Image src='/logo.svg' alt='logo' width={100} height={100} priority/>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 w-full">
                    <label className="block mb-2">Заголовок</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <label className="block mb-2">Описание</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      className="w-full p-2 border rounded resize-none h-[100px]"
                      required
                    />
                  </div>
                  <div className="mb-4 w-full relative">
                    <label 
                      className={`block mb-2 cursor-pointer ${isDragOver ? 'bg-blue-100 border-blue-600' : ''}`} 
                      onDragOver={handleDragOver} 
                      onDragLeave={handleDragLeave} 
                      onDrop={handleDrop}
                    >
                      <input 
                        type="file" 
                        ref={coverRef} 
                        onChange={handleImageChange} 
                        className="hidden"
                        required
                      />
                      {imagePreview ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="preview"
                            width={300}
                            height={200}
                            layout="fixed"
                            className="rounded-md"
                          />
                          <button type="button" onClick={handleRemoveImage} className="absolute right-1 top-1 bg-red-500 text-white text-sm rounded-full w-[20px] h-[20px]">X</button>
                        </>
                      ) : (
                        <div className="justify-center items-center h-[100px] flex flex-col border-dashed border-2 border-cyan-400 rounded-md">
                          <PlusIcon />
                          <span className="mt-2 text-base leading-normal block">Выберите изображение</span>
                        </div>
                      )}
                    </label>
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
