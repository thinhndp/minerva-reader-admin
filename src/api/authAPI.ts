import axios from 'axios';

export const login = (username: string, password: string) => {
  return axios.post('/login', { username, password });
}

export const signUp = (email: string, username: string, password: string) => {
  return axios.post('/register', { email, username, password });
}

export const checkToken = (tokenStr: string) => {
  console.log(tokenStr);
  return axios.get(`/check-token/${tokenStr}`);
}