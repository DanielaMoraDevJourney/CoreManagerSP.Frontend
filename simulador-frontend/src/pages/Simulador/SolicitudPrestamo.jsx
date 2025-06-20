import { useState, useEffect } from 'react';
import './SolicitudPrestamo.css';
import Swal from 'sweetalert2';
import { crearSolicitudPrestamo, getTiposPrestamo } from '../../services/solicitudService';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SolicitudPrestamo = () => {
    const [tiposPrestamo, setTiposPrestamo] = useState([]);
    const [tipoPrestamoId, setTipoPrestamoId] = useState('');
    const navigate = useNavigate();

    const [monto, setMonto] = useState('');
    const [plazo, setPlazo] = useState('');
    const [proposito, setProposito] = useState('');
    const [cuotaCliente, setCuotaCliente] = useState('');

    const [ingresos, setIngresos] = useState('');
    const [nivelHistorial, setNivelHistorial] = useState('');
    const [deudas, setDeudas] = useState('');
    const [cuotasComprometidas, setCuotasComprometidas] = useState('');
    const [creditosActivos, setCreditosActivos] = useState('');
    const [aniosHistorial, setAniosHistorial] = useState('');
    const [haTenidoMora, setHaTenidoMora] = useState(false);
    const [tieneTarjeta, setTieneTarjeta] = useState(false);
    const { userData } = useAuth();
    const usuarioId = parseInt(
        userData?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    );
    const [fechaUltimoIncumplimiento, setFechaUltimoIncumplimiento] = useState('');

    useEffect(() => {
        const cargarTipos = async () => {
            try {
                const data = await getTiposPrestamo();
                setTiposPrestamo(data);
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar los tipos de préstamo', 'error');
            }
        };
        cargarTipos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (
            !usuarioId ||
            !tipoPrestamoId ||
            !monto ||
            !plazo ||
            !ingresos ||
            !aniosHistorial ||
            !fechaUltimoIncumplimiento
        ) {
            Swal.fire(
                'Campos vacíos',
                'Todos los campos obligatorios deben ser completados.',
                'error'
            );
            return;
        }

        const payload = {
            usuarioId,
            ingreso: parseFloat(ingresos),
            tarjetaCredito: tieneTarjeta,
            haTenidoMora,
            aniosHistorialCrediticio: parseInt(aniosHistorial),
            deudasVigentes: parseFloat(deudas || '0'),
            cuotasMensualesComprometidas: parseFloat(cuotasComprometidas || '0'),
            numeroCreditosActivos: parseInt(creditosActivos || '0'),
            tiempoUltimoIncumplimiento: fechaUltimoIncumplimiento,
            tipoPrestamoId: parseInt(tipoPrestamoId),
            monto: parseFloat(monto),
            plazo: parseInt(plazo),
            proposito,
            cuotaEstimadaCliente: parseFloat(cuotaCliente || '0')
        };

        try {

            const resultado = await crearSolicitudPrestamo(payload);

            const solicitudId = resultado.solicitudId;
            Swal.fire(
                '¡Simulación enviada!',
                'Redirigiendo al ranking...',
                'success'
            ).then(() => {
                navigate(`/solicitudes/${solicitudId}/ranking`);
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo enviar la simulación', 'error');
        }
    };

    return (
        <section className="solicitud">
            <h2>Solicitud de Préstamo</h2>
            <p>Complete el formulario para simular su préstamo</p>

            <form className="solicitud__form" onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Tipo de Préstamo</legend>
                    <label>
                        Seleccione el tipo de préstamo
                        <select
                            value={tipoPrestamoId}
                            onChange={(e) => setTipoPrestamoId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            {tiposPrestamo.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Datos de la Solicitud</legend>

                    <label>
                        Monto solicitado
                        <input
                            type="number"
                            placeholder="$ 0.00"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Plazo en meses
                        <input
                            type="number"
                            placeholder="Ej: 36"
                            value={plazo}
                            onChange={(e) => setPlazo(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Propósito del préstamo
                        <input
                            type="text"
                            placeholder="Describa brevemente el propósito"
                            value={proposito}
                            onChange={(e) => setProposito(e.target.value)}
                        />
                    </label>

                    <label>
                        Cuota estimada según el cliente{' '}
                        <span style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                            (opcional)
                        </span>
                        <input
                            type="number"
                            placeholder="$ 0.00"
                            value={cuotaCliente}
                            onChange={(e) => setCuotaCliente(e.target.value)}
                        />
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Datos del Usuario para Evaluación</legend>

                    <label>
                        Ingresos mensuales
                        <input
                            type="number"
                            placeholder="$ 0.00"
                            value={ingresos}
                            onChange={(e) => setIngresos(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Nivel de historial crediticio
                        <select
                            value={nivelHistorial}
                            onChange={(e) => setNivelHistorial(e.target.value)}
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="ALTO">Alto</option>
                            <option value="MEDIO">Medio</option>
                            <option value="BAJO">Bajo</option>
                        </select>
                    </label>

                    <label>
                        Deudas vigentes
                        <input
                            type="number"
                            placeholder="$ 0.00"
                            value={deudas}
                            onChange={(e) => setDeudas(e.target.value)}
                        />
                    </label>

                    <label>
                        Cuotas mensuales comprometidas
                        <input
                            type="number"
                            placeholder="$ 0.00"
                            value={cuotasComprometidas}
                            onChange={(e) => setCuotasComprometidas(e.target.value)}
                        />
                    </label>

                    <label>
                        Número de créditos activos
                        <input
                            type="number"
                            placeholder="0"
                            value={creditosActivos}
                            onChange={(e) => setCreditosActivos(e.target.value)}
                        />
                    </label>

                    <label>
                        Años de historial crediticio
                        <input
                            type="number"
                            placeholder="0"
                            value={aniosHistorial}
                            onChange={(e) => setAniosHistorial(e.target.value)}
                            required
                        />
                    </label>

                    <label className="checkbox-group">
                        <input
                            type="checkbox"
                            checked={haTenidoMora}
                            onChange={(e) => setHaTenidoMora(e.target.checked)}
                        />
                        ¿Ha tenido mora?
                    </label>

                    <label className="checkbox-group">
                        <input
                            type="checkbox"
                            checked={tieneTarjeta}
                            onChange={(e) => setTieneTarjeta(e.target.checked)}
                        />
                        ¿Posee tarjeta de crédito?
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Fecha del Último Incumplimiento</legend>
                    <label>
                        Seleccione una fecha
                        <input
                            type="date"
                            className="solicitud__input-date"
                            value={fechaUltimoIncumplimiento}
                            onChange={(e) => setFechaUltimoIncumplimiento(e.target.value)}
                            required
                        />
                    </label>
                </fieldset>

                <button type="submit">Simular</button>
            </form>
        </section>
    );
};
