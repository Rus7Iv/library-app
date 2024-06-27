"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { PlusIcon } from '@/assets/PlusIcon';
import { createBook } from '@/api/api';

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const coverRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cover = coverRef.current?.files?.[0] || null;

    try {
      const response = await createBook(title, description, cover);
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
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = loadEvent => {
        if (loadEvent.target) {
          const base64Image = loadEvent.target.result as string;
          setImagePreview(base64Image);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImagePreview('');
    if (coverRef.current) {
      coverRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = loadEvent => {
        if (loadEvent.target) {
          const base64Image = loadEvent.target.result as string;
          setImagePreview(base64Image);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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
  );
};

export default CreateBook;
