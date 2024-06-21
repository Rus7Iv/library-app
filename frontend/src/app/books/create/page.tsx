import { useState } from 'react';
import axios from 'axios';

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const response = await axios.post('/api/books', { title, description, cover });
    if (response.status === 201) {
      alert('Book created successfully');
      setTitle('');
      setDescription('');
      setCover('');
    } else {
      alert('Error creating book');
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
          <label className="block mb-2">Cover URL</label>
          <input 
            type="text" 
            value={cover} 
            onChange={(e) => setCover(e.target.value)} 
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
