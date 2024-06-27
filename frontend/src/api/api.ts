import axios from 'axios';
import { Book } from '@/utils/types';

interface BooksResponse {
  total_pages: number;
  books: Book[];
}

export const fetchBooks = async (page: number): Promise<BooksResponse> => {
  const response = await axios.get<BooksResponse>(`/api/books?page=${page}`);
  return response.data;
};

export const createBook = async (title: string, description: string, cover: File | null) => {
  const formData = new FormData();
  formData.append('book', JSON.stringify({ title, description }));
  if (cover) {
    formData.append('cover', cover);
  }

  const response = await axios.post('/api/books', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};
