import axiosInstance from '../api/axios';

interface RegisterData {
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
}

export const register = async (data: RegisterData): Promise<void> => {
    await axiosInstance.post('/Auth/register', data);
};
