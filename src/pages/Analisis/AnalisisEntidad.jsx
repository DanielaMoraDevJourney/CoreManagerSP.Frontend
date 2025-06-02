import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../api/axiosInstance';
import './AnalisisEntidad.css';

export const AnalisisEntidad = () => {
  const { solicitudId, entidadId } = useParams();
  const navigate = useNavigate();

  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [applying, setApplying] = useState(false); 

  useEffect(() => {
    const fetchAnalisis = async () => {
      console.log(
        `[AnalisisEntidad] Iniciando fetch para solicitudId=${solicitudId}, entidadId=${entidadId}`
      );
      setLoading(true);
      setErrorMsg('');

      try {
        const res = await axiosInstance.get(
          `/SolicitudPrestamo/${solicitudId}/analisis-entidad/${entidadId}`
        );
        console.log('[AnalisisEntidad] Respuesta completa:', res.data);

        const data = res.data;
        const criteriosArray = data.criterios?.$values || [];
        const mejorasArray = data.mejoras?.$values || [];

        const analisisFormateado = {
          nombreEntidad: data.nombreEntidad,
          probabilidadAprobacion: data.probabilidadAprobacion,
          cuotaMensualEstimada: data.cuotaMensualEstimada,
          esApto: data.esApto,
          criterios: criteriosArray.map((c) => ({
            criterio: c.criterio,
            valorUsuario: c.valorUsuario,
            valorRequerido: c.valorRequerido,
            cumple: c.cumple,
          })),
          mejoras: mejorasArray.map((m) => ({
            variable: m.variable,
            valorSugerido: m.valorSugerido,
            descripcion: m.descripcion,
            impactoEstimado: m.impactoEstimado,
            esObligatoria: m.esObligatoria,
            prioridad: m.prioridad,
          })),
        };

        console.log('[AnalisisEntidad] Datos formateados:', analisisFormateado);
        setAnalisis(analisisFormateado);
      } catch (err) {
        console.error('[AnalisisEntidad] Error al obtener análisis:', err);
        setErrorMsg('No se pudo cargar el análisis de la entidad. Intenta más tarde.');
        Swal.fire('Error', 'No se pudo cargar el análisis de la entidad.', 'error');
      } finally {
        setLoading(false);
        console.log('[AnalisisEntidad] fetchAnalisis: loading=false');
      }
    };

    fetchAnalisis();
  }, [solicitudId, entidadId]);

  const manejarVolver = () => {
    console.log('[AnalisisEntidad] Volver al ranking');
    navigate(`/solicitudes/${solicitudId}/ranking`);
  };


  const aplicarMejoras = async () => {
    if (!analisis || !analisis.mejoras.length) {
      Swal.fire('Info', 'No hay mejoras sugeridas para aplicar.', 'info');
      return;
    }

    setApplying(true);
    console.log('[AnalisisEntidad] Aplicando mejoras sugeridas automáticamente');

    const mejorasSeleccionadasPayload = analisis.mejoras.map((m) => ({
      variable: m.variable,
      valorNuevo: m.valorSugerido,
      esManual: false, // “false” porque es un cambio sugerido automáticamente
    }));

    const payload = {
      solicitudId: Number(solicitudId),
      mejorasSeleccionadas: mejorasSeleccionadasPayload,
    };

    console.log('[AnalisisEntidad] Payload para aplicar-mejoras-avanzado:', payload);

    try {
      const res = await axiosInstance.post('/SolicitudPrestamo/aplicar-mejoras-avanzado', payload);
      console.log('[AnalisisEntidad] Respuesta de aplicar-mejoras-avanzado:', res.data);

      // Estructura de respuesta esperada:
      // {
      //   mensaje: "string",
      //   fecha: "2025-06-02T20:44:30.221Z",
      //   perfilActualizado: { ... },
      //   solicitudOriginal: { id: 0, ..., ranking: [ ... ] },
      //   solicitudMejorada: { id: 1, ..., ranking: [ ... ] },
      //   cambiosAplicados: [ { variable, valorAnterior, valorNuevo }, ... ]
      // }

      const data = res.data;
      const nuevaSolicitudId = data.solicitudMejorada?.id;

      Swal.fire('Éxito', data.mensaje || 'Mejoras aplicadas correctamente.', 'success');

      if (nuevaSolicitudId) {
        console.log(
          `[AnalisisEntidad] Redirigiendo al ranking de la solicitud mejorada con id = ${nuevaSolicitudId}`
        );
        navigate(`/solicitudes/${nuevaSolicitudId}/ranking`);
      } else {
        console.warn('[AnalisisEntidad] No se encontró solicitudMejorada.id en la respuesta');
      }
    } catch (err) {
      console.error('[AnalisisEntidad] Error al aplicar mejoras:', err);
      Swal.fire('Error', 'No se pudieron aplicar las mejoras.', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    console.log('[AnalisisEntidad] Renderizando estado "loading"');
    return <p className="analisis__loading">Cargando análisis…</p>;
  }

  if (errorMsg) {
    console.log('[AnalisisEntidad] Renderizando estado "errorMsg":', errorMsg);
    return <p className="analisis__error">{errorMsg}</p>;
  }

  if (!analisis) {
    console.log('[AnalisisEntidad] Renderizando estado "empty" (sin datos)');
    return <p className="analisis__empty">No hay datos de análisis disponibles.</p>;
  }

  return (
    <section className="analisis">
      <button className="analisis__back-button" onClick={manejarVolver}>
        &larr; Volver al ranking
      </button>

      <h1 className="analisis__title">{analisis.nombreEntidad}</h1>

      <div className="analisis__resumen-general">
        <p className="analisis__resumen-item">
          <strong>Probabilidad de aprobación:</strong>{' '}
          {(analisis.probabilidadAprobacion * 100).toFixed(2)}%
        </p>
        <p className="analisis__resumen-item">
          <strong>Cuota mensual estimada:</strong> $
          {analisis.cuotaMensualEstimada.toFixed(2)}
        </p>
        <p
          className={`analisis__resumen-estado ${analisis.esApto
              ? 'analisis__resumen-estado--apto'
              : 'analisis__resumen-estado--no-apto'
            }`}
        >
          {analisis.esApto ? 'Apto' : 'No apto'}
        </p>
      </div>


      <section className="analisis__criterios">
        <h2 className="analisis__section-title">Criterios Evaluados</h2>
        <ul className="analisis__criterios-list">
          {analisis.criterios.map((crit, idx) => (
            <li key={idx} className="analisis__criterio-item">
              <div className="analisis__criterio-nombre">{crit.criterio}</div>
              <div className="analisis__criterio-valores">
                <span className="analisis__criterio-valorUsu">
                  <strong>Valor Usuario:</strong> {crit.valorUsuario}
                </span>
                <span className="analisis__criterio-valorReq">
                  <strong>Valor Requerido:</strong> {crit.valorRequerido}
                </span>
              </div>
              <div
                className={`analisis__criterio-cumple ${crit.cumple
                    ? 'analisis__criterio--cumple'
                    : 'analisis__criterio--no-cumple'
                  }`}
              >
                {crit.cumple ? 'Cumple' : 'No cumple'}
              </div>
            </li>
          ))}
        </ul>
      </section>


      <section className="analisis__mejoras">
        <h2 className="analisis__section-title">Sugerencias de Mejora</h2>
        <ul className="analisis__mejoras-list">
          {analisis.mejoras.map((m, idx) => (
            <li key={idx} className="analisis__mejora-item">
              <p>
                <strong>{m.variable}:</strong> {m.valorSugerido}
              </p>
              <p className="analisis__mejora-desc">{m.descripcion}</p>
              <p className="analisis__mejora-info">
                <strong>Impacto estimado:</strong>{' '}
                {(m.impactoEstimado * 100).toFixed(0)}%
                {m.esObligatoria && (
                  <span className="analisis__mejora-obligatoria"> (Obligatoria)</span>
                )}
                <span className="analisis__mejora-prioridad">
                  {' '}
                  | Prioridad: {m.prioridad}
                </span>
              </p>
            </li>
          ))}
        </ul>

        <button
          className="analisis__apply-button"
          onClick={aplicarMejoras}
          disabled={applying}
        >
          {applying ? 'Aplicando mejoras...' : 'Aplicar mejoras sugeridas'}
        </button>
      </section>
    </section>
  );
};
