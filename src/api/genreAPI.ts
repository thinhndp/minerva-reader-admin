import axios from 'axios';
import { GenreInput } from '../interfaces/genre';

// export function getAllGenres(): Promise<AxiosResponse> {
//   return axios.get('/genres');
// }

export const getAllGenres = () => {
  return axios.get('/categories');
}

export const addGenre = (data: GenreInput) => {
  return axios.post('/categories', data);
}

export const updateGenre = (id: string, data: GenreInput) => {
  return axios.put(`/categories/${id}`, data);
}

export const deleteGenre = (id: string) => {
  return axios.delete(`/categories/${id}`);
}