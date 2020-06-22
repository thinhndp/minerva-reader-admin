import axios from 'axios';
import { BookInput } from '../interfaces/book';

export const getAllBooks = () => {
	return axios.get('/books');
}

export const createBook = (data: BookInput) => {
	return axios.post('/books', data);
}

export const updateBook = (id: string, data: BookInput) => {
	return axios.put(`/books/${id}`, data);
}

export const deleteBook = (id: string) => {
	return axios.delete(`/books/${id}`);
}
