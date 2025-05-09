import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { RutaUsuario } from './RutaUsuario';
import { LayoutUsuario } from '../pages/LayoutUsuario';
import { SolicitudPrestamo } from '../pages/Simulador/SolicitudPrestamo';
/*
import { HistorialSimulaciones } from '../pages/Historial/HistorialSimulaciones';
import { CompararEntidades } from '../pages/Comparacion/CompararEntidades';
import { AnalisisEntidad } from '../pages/Analisis/AnalisisEntidad';
import { AplicarMejoras } from '../pages/Mejoras/AplicarMejoras'; */

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
{/* 
                <Route path="historial" element={<HistorialSimulaciones />} />
                <Route path="comparar" element={<CompararEntidades />} />
                <Route path="analisis/:entidadId" element={<AnalisisEntidad />} />
                <Route path="mejoras" element={<AplicarMejoras />} /> */}

            </Route>
        </Routes>
    </BrowserRouter>
);
