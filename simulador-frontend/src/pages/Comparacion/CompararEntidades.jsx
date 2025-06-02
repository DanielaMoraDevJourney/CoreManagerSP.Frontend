import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../api/axiosInstance';
import './CompararEntidades.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const CompararEntidades = () => {
  const { solicitudId } = useParams();
  const query = useQuery();
  const navigate = useNavigate();

  const [comparacion, setComparacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const idsParam = query.get('ids') || '';

  useEffect(() => {
    const fetchComparacion = async () => {
      const entidadesAComparar = idsParam
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));

      if (entidadesAComparar.length < 2) {
        setComparacion([]);    
        setErrorMsg('Selecciona al menos dos entidades para comparar.');
        setLoading(false);
        return;
      }

      console.log(
        `[CompararEntidades] Fetching comparación para solicitudId=${solicitudId}, entidadesIds=[${entidadesAComparar.join(
          ','
        )}]`
      );
      setErrorMsg('');
      setLoading(true);

      try {
        const payload = {
          solicitudId: Number(solicitudId),
          entidadesIds: entidadesAComparar,
        };

        console.log(
          '[CompararEntidades] Payload para comparar-entidades:',
          payload
        );
        const res = await axiosInstance.post(
          '/SolicitudPrestamo/comparar-entidades',
          payload
        );
        console.log('[CompararEntidades] Respuesta completa:', res.data);

        // Extraer $values y formatear
        const values = res.data?.$values || [];
        const comparacionFormateada = values.map((ent) => {
          const criteriosArr = ent.criterios?.$values || [];
          const mejorasArr = ent.mejoras?.$values || [];

          return {
            entidadId: ent.entidadId,
            nombreEntidad: ent.nombreEntidad,
            probabilidadAprobacion: ent.probabilidadAprobacion,
            cuotaMensualEstimada: ent.cuotaMensualEstimada,
            esApto: ent.esApto,
            criterios: criteriosArr.map((c) => ({
              criterio: c.criterio,
              valorUsuario: c.valorUsuario,
              valorRequerido: c.valorRequerido,
              cumple: c.cumple,
            })),
            mejoras: mejorasArr.map((m) => ({
              variable: m.variable,
              valorSugerido: m.valorSugerido,
              descripcion: m.descripcion,
              impactoEstimado: m.impactoEstimado,
              esObligatoria: m.esObligatoria,
              prioridad: m.prioridad,
            })),
          };
        });

        console.log(
          '[CompararEntidades] Datos formateados para comparación:',
          comparacionFormateada
        );
        setComparacion(comparacionFormateada);
      } catch (err) {
        console.error('[CompararEntidades] Error al obtener comparación:', err);
        setErrorMsg(
          'No se pudo cargar la comparación. Intenta de nuevo más tarde.'
        );
        Swal.fire('Error', 'No se pudo cargar la comparación.', 'error');
      } finally {
        setLoading(false);
        console.log('[CompararEntidades] fetchComparacion: loading=false');
      }
    };

    fetchComparacion();
  }, [solicitudId, idsParam]); 

  const manejarVolver = () => {
    console.log('[CompararEntidades] Volver al ranking');
    navigate(-1);
  };

  if (loading) {
    console.log('[CompararEntidades] Renderizando estado "loading"');
    return <p className="comparar__loading">Cargando comparación…</p>;
  }

  if (errorMsg) {
    console.log('[CompararEntidades] Renderizando estado "errorMsg":', errorMsg);
    return <p className="comparar__error">{errorMsg}</p>;
  }

  if (comparacion.length < 2) {
    console.log(
      '[CompararEntidades] Renderizando estado "empty" (menos de 2 entidades)'
    );
    return (
      <p className="comparar__empty">
        Selecciona al menos dos entidades para comparar.
      </p>
    );
  }

  return (
    <section className="comparar">
      <button className="comparar__back-button" onClick={manejarVolver}>
        &larr; Volver
      </button>

      <h1 className="comparar__title">
        Comparación – Solicitud #{solicitudId}
      </h1>

      <div className="comparar__grid">
        {comparacion.map((ent, idx) => (
          <div key={idx} className="comparar__card">
            <h2 className="comparar__card-title">{ent.nombreEntidad}</h2>
            <p className="comparar__card-prob">
              <strong>Probabilidad:</strong>{' '}
              {(ent.probabilidadAprobacion * 100).toFixed(2)}%
            </p>
            <p className="comparar__card-cuota">
              <strong>Cuota estimada:</strong> $
              {ent.cuotaMensualEstimada.toFixed(2)}
            </p>
            <p
              className={`comparar__card-estado ${ent.esApto
                  ? 'comparar__card-estado--apto'
                  : 'comparar__card-estado--no-apto'
                }`}
            >
              {ent.esApto ? 'Apto' : 'No apto'}
            </p>

            <section className="comparar__seccion-criterios">
              <h3 className="comparar__subtitulo">Criterios</h3>
              <ul className="comparar__lista-criterios">
                {ent.criterios.map((c, i) => (
                  <li key={i} className="comparar__item-criterio">
                    <div className="comparar__criterio-nombre">{c.criterio}</div>
                    <div className="comparar__criterio-valores">
                      <span className="comparar__valor-usuario">
                        <strong>Usuario:</strong> {c.valorUsuario}
                      </span>
                      <span className="comparar__valor-requerido">
                        <strong>Requerido:</strong> {c.valorRequerido}
                      </span>
                    </div>
                    <div
                      className={`comparar__criterio-cumple ${c.cumple
                          ? 'comparar__criterio--cumple'
                          : 'comparar__criterio--no-cumple'
                        }`}
                    >
                      {c.cumple ? 'Cumple' : 'No cumple'}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="comparar__seccion-mejoras">
              <h3 className="comparar__subtitulo">Mejoras sugeridas</h3>
              <ul className="comparar__lista-mejoras">
                {ent.mejoras.map((m, j) => (
                  <li key={j} className="comparar__item-mejora">
                    <p className="comparar__mejora-variable">
                      <strong>{m.variable}:</strong> {m.valorSugerido}
                    </p>
                    <p className="comparar__mejora-desc">{m.descripcion}</p>
                    <p className="comparar__mejora-info">
                      <strong>Impacto:</strong> {(m.impactoEstimado * 100).toFixed(0)}%
                      {m.esObligatoria && (
                        <span className="comparar__mejora-obligatoria">
                          {' '}
                          (Obligatoria)
                        </span>
                      )}
                      <span className="comparar__mejora-prioridad">
                        {' '}
                        | Prioridad: {m.prioridad}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ))}
      </div>
    </section>
  );
};
