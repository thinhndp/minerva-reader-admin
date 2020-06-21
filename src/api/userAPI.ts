import axios from 'axios';
import { UserInput, UserUpdateRoleInput } from '../interfaces/user';

export const getAllUsers = () => {
  console.log('alo');
  return axios.get('/users');
}

// export const addUser = (data: UserInput) => {
//   return axios.post('/users', data);
// }

export const updateUser = (id: string, data: UserInput) => {
  return axios.put(`/users/update/${id}`, data);
}

export const updateUserRole = (data: UserUpdateRoleInput) => {
  return axios.put('/users/update-roles', data);
}

// export const deleteUser = (id: string) => {
//   return axios.delete(`/users/${id}`);
// }