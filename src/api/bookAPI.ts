import axios from 'axios';

export const getAllBooks = () => {
  return axios.get('/books');
}
