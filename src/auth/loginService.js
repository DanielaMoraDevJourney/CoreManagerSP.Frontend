import axiosInstance from '../api/axiosInstance';

export const login = async (data) => {
  const response = await axiosInstance.post('/auth/usuario/login', data);
  return response.data;
};