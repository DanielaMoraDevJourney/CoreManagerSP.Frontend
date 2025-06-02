import axiosInstance from '../api/axiosInstance';


export const crearSolicitudPrestamo = async (payload: any) => {
    const response = await axiosInstance.post('/SolicitudPrestamo/simulacion-completa', payload);
    return response.data;
};


export const getTiposPrestamo = async () => {
    const response = await axiosInstance.get('/SolicitudPrestamo/combo');
    const data = response.data;
    return Array.isArray(data) ? data : data.$values ?? [];
};


