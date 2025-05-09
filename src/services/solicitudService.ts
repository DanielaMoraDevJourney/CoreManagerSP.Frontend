import axiosInstance from '../api/axios';


export const crearSolicitudPrestamo = async (payload: any) => {
    const response = await axiosInstance.post('/SolicitudPrestamo/simulacion-completa', payload);
    return response.data;
};


export const getTiposPrestamo = async () => {
    const response = await axiosInstance.get('/SolicitudPrestamo/combo');
    // Verifica si es un array plano o con $values
    const data = response.data;
    return Array.isArray(data) ? data : data.$values ?? [];
};


