import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../api/axiosInstance';
import './Ranking.css';

export const Ranking = () => {
    const { solicitudId } = useParams();
    const navigate = useNavigate();

    const [ranking, setRanking] = useState([]);
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchRanking = async () => {
            console.log('[Ranking] Iniciando fetch de ranking para solicitudId =', solicitudId);
            setLoading(true);
            setErrorMsg('');

            try {
                // Usamos axiosInstance para incluir el token en headers
                const res = await axiosInstance.get(`/SolicitudPrestamo/ranking/${solicitudId}`);
                console.log('[Ranking] Respuesta completa del endpoint:', res);

                // La lista de entidades viene en res.data.$values
                const lista = res.data?.$values || [];
                console.log('[Ranking] Lista extraída (res.data.$values):', lista);

                setRanking(lista);
            } catch (err) {
                console.error('[Ranking] Error al obtener ranking:', err);
                setErrorMsg('No se pudo cargar el ranking. Intenta de nuevo más tarde.');
                Swal.fire('Error', 'No se pudo cargar el ranking.', 'error');
            } finally {
                setLoading(false);
                console.log('[Ranking] fetchRanking: loading=false');
            }
        };

        fetchRanking();
    }, [solicitudId]);

    // -----------------------------------------------------
    // Al marcar/desmarcar un checkbox
    // -----------------------------------------------------
    const toggleSeleccion = (entidadId) => {
        console.log('[Ranking] toggleSeleccion llamada con entidadId =', entidadId);
        setSeleccionadas((prev) => {
            const yaEstaba = prev.includes(entidadId);
            const nuevas = yaEstaba
                ? prev.filter((id) => id !== entidadId)
                : [...prev, entidadId];
            console.log('[Ranking] Seleccionadas actualizadas:', nuevas);
            return nuevas;
        });
    };

    // -----------------------------------------------------
    // Navegar a la pantalla de análisis individual
    // Aquí es donde se realiza la REDIRECCIÓN
    // -----------------------------------------------------
    const irAAnalisis = (entidadId) => {
        console.log(
            `[Ranking] Navegando a análisis-entidad con solicitudId=${solicitudId}, entidadId=${entidadId}`
        );
        // REDIRECCIÓN: al hacer clic en "Ver análisis", navegamos a:
        // /solicitudes/{solicitudId}/analisis-entidad/{entidadId}
        navigate(`/solicitudes/${solicitudId}/analisis-entidad/${entidadId}`);
    };

    // -----------------------------------------------------
    // Navegar a la pantalla de comparar (con query string de IDs)
    // -----------------------------------------------------
    const irAComparar = () => {
        console.log('[Ranking] Intento de comparar IDs:', seleccionadas);

        if (seleccionadas.length < 2) {
            console.warn('[Ranking] Se requieren al menos dos entidades para comparar.');
            Swal.fire('Atención', 'Selecciona al menos dos entidades para comparar.', 'info');
            return;
        }

        const queryIds = seleccionadas.join(',');
        console.log('[Ranking] Navegando a comparar-entidades?ids=' + queryIds);
        navigate(`/solicitudes/${solicitudId}/comparar-entidades?ids=${queryIds}`);
    };

    if (loading) {
        console.log('[Ranking] Renderizando estado "loading"');
        return <p className="ranking__loading">Cargando ranking…</p>;
    }

    if (errorMsg) {
        console.log('[Ranking] Renderizando estado "errorMsg":', errorMsg);
        return <p className="ranking__error">{errorMsg}</p>;
    }

    if (ranking.length === 0) {
        console.log('[Ranking] Renderizando estado "empty" (no hay entidades)');
        return <p className="ranking__empty">No hay entidades disponibles para este ranking.</p>;
    }

    return (
        <section className="ranking">
            <h1 className="ranking__title">
                Ranking de Entidades – Solicitud #{solicitudId}
            </h1>
            <p className="ranking__subtitle">
                Estas entidades están ordenadas por probabilidad de aprobación.
            </p>

            <button
                className="ranking__compare-button"
                onClick={irAComparar}
                disabled={seleccionadas.length < 2}
            >
                Comparar seleccionadas ({seleccionadas.length})
            </button>

            <div className="ranking__cards">
                {ranking.map((ent) => (
                    <div key={ent.entidadId} className="ranking__card">
                        <header className="ranking__card-header">
                            <h2 className="ranking__card-name">{ent.nombreEntidad}</h2>

                            <label className="ranking__checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={seleccionadas.includes(ent.entidadId)}
                                    onChange={() => toggleSeleccion(ent.entidadId)}
                                />
                                Seleccionar
                            </label>
                        </header>

                        <div className="ranking__card-body">
                            <p className="ranking__card-prob">
                                <strong>Probabilidad:</strong>{' '}
                                {(ent.probabilidadAprobacion * 100).toFixed(2)}%
                            </p>
                            <p className="ranking__card-cuota">
                                <strong>Cuota estimada:</strong> $
                                {ent.cuotaMensualEstimada.toFixed(2)}
                            </p>
                            <p
                                className={`ranking__card-estado ${ent.esApto ? 'ranking__card-estado--apto' : 'ranking__card-estado--no-apto'
                                    }`}
                            >
                                {ent.esApto ? 'Apto' : 'No apto'}
                            </p>
                        </div>

                        <footer className="ranking__card-footer">
                            <button
                                className="ranking__card-button"
                                onClick={() => irAAnalisis(ent.entidadId)} // ← REDIRECCIÓN AQUI
                            >
                                Ver análisis
                            </button>
                        </footer>
                    </div>
                ))}
            </div>
        </section>
    );
};
