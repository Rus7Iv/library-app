"use client";

import { useState, useRef } from 'react';
import axios from 'axios';

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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Cover</label>
          <input 
            type="file" 
            ref={coverRef} 
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Create</button>
      </form>
    </div>
  );
};

export default CreateBook;
