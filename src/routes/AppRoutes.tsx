import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { RutaUsuario } from './RutaUsuario';
import { LayoutUsuario } from '../pages/LayoutUsuario';
import { SolicitudPrestamo } from '../pages/Simulador/SolicitudPrestamo';
import { EnConstruccion } from '../pages/Temporal/EnConstruccion';

export const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />

            <Route
                path="/"
                element={
                    <RutaUsuario>
                        <LayoutUsuario />
                    </RutaUsuario>
                }
            >
                <Route path="solicitud" element={<SolicitudPrestamo />} />
                {/* Otras rutas futuras comentadas */}
            </Route>

            {/* Ruta para páginas no encontradas o en construcción */}
            <Route path="*" element={<EnConstruccion />} />
        </Routes>
    </BrowserRouter>
);
