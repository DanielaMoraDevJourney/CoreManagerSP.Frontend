import axiosInstance from '../api/axios';

interface LoginData {
    correo: string;
    contrasena: string;
}

export const login = async (data: LoginData) => {
    const response = await axiosInstance.post('/Auth/login', data);
    return response.data;
};
