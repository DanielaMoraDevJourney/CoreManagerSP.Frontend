import axiosInstance from '../api/axiosInstance';

export const register = async (data) => {
  await axiosInstance.post('/auth/usuario/register', data);
};