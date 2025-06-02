import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { LayoutUsuario } from '../pages/LayoutUsuario';
import { SolicitudPrestamo } from '../pages/Simulador/SolicitudPrestamo';
import { EnConstruccion } from '../pages/Temporal/EnConstruccion';
import { RutaUsuario } from './RutaUsuario';
import { Ranking } from '../pages/Resultados/Ranking';
import { AnalisisEntidad } from '../pages/Analisis/AnalisisEntidad';
import { CompararEntidades } from '../pages/Comparacion/CompararEntidades';

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

                <Route path="solicitudes/:solicitudId/ranking" element={<Ranking />} />

                <Route
                    path="solicitudes/:solicitudId/analisis-entidad/:entidadId"
                    element={<AnalisisEntidad />}
                />

                <Route
                    path="solicitudes/:solicitudId/comparar-entidades"
                    element={<CompararEntidades />}
                />
            </Route>

            <Route path="*" element={<EnConstruccion />} />
        </Routes>
    </BrowserRouter>
);
