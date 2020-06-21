import axios from 'axios';
import { AuthorInput } from '../interfaces/author';

export const getAllAuthors = () => {
	return axios.get('/authors');
}

export const addAuthor = (data: AuthorInput) => {
	return axios.post('/authors', data);
}

export const updateAuthor = (id: string, data: AuthorInput) => {
	return axios.put(`/authors/${id}`, data);
}

export const deleteAuthor = (id: string) => {
	return axios.delete(`/authors/${id}`);
}
