import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../auth/loginService';
import { register } from '../../auth/registerService';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import './Login.css';

export const Login = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [confirmar, setConfirmar] = useState('');

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login({ correo, contrasena });
            authLogin(response.token);

            const decoded = JSON.parse(atob(response.token.split('.')[1]));
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            if (role === 'Usuario') {
                navigate('/solicitud');
            } else if (role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: 'Credenciales incorrectas o error del servidor',
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (contrasena !== confirmar) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseñas no coinciden',
                text: 'Verifica que ambas contraseñas sean iguales',
            });
            return;
        }

        try {
            await register({ nombre, apellido, correo, contrasena });
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión.',
                confirmButtonColor: '#7145d6'
            });
            setActiveTab('login');
            setNombre('');
            setApellido('');
            setCorreo('');
            setContrasena('');
            setConfirmar('');
        } catch (error) {
            console.error('Error al registrarse:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrarse',
                text: 'Ya existe un usuario con ese correo',
            });
        }
    };

    return (
        <main className="login">
            <section className="login__card">
                <h1 className="login__title">Simulador de Préstamos</h1>
                <p className="login__subtitle">Inicia sesión o regístrate para continuar</p>

                <nav className="login__tabs">
                    <button
                        className={`login__tab ${activeTab === 'login' ? 'login__tab--active' : ''}`}
                        onClick={() => setActiveTab('login')}
                        type="button"
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        className={`login__tab ${activeTab === 'register' ? 'login__tab--active' : ''}`}
                        onClick={() => setActiveTab('register')}
                        type="button"
                    >
                        Registrarse
                    </button>
                </nav>

                {activeTab === 'login' ? (
                    <form className="login__form" onSubmit={handleLogin}>
                        <label className="login__label">
                            Correo Electrónico
                            <input
                                type="email"
                                className="login__input"
                                placeholder="ejemplo@correo.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </label>

                        <label className="login__label">
                            Contraseña
                            <input
                                type="password"
                                className="login__input"
                                placeholder="••••••••"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                        </label>

                        <section className="login__extras">
                            <label className="login__remember">
                                <input type="checkbox" /> Recordarme
                            </label>
                            <a className="login__forgot" href="#">¿Olvidaste tu contraseña?</a>
                        </section>

                        <button className="login__button" type="submit">
                            Iniciar Sesión
                        </button>
                    </form>
                ) : (
                    <form className="login__form" onSubmit={handleRegister}>
                        <label className="login__label">
                            Nombre
                            <input
                                type="text"
                                className="login__input"
                                placeholder="Tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </label>

                        <label className="login__label">
                            Apellido
                            <input
                                type="text"
                                className="login__input"
                                placeholder="Tu apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                            />
                        </label>

                        <label className="login__label">
                            Correo Electrónico
                            <input
                                type="email"
                                className="login__input"
                                placeholder="ejemplo@correo.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </label>

                        <label className="login__label">
                            Contraseña
                            <input
                                type="password"
                                className="login__input"
                                placeholder="••••••••"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                        </label>

                        <label className="login__label">
                            Confirmar contraseña
                            <input
                                type="password"
                                className="login__input"
                                placeholder="••••••••"
                                value={confirmar}
                                onChange={(e) => setConfirmar(e.target.value)}
                                required
                            />
                        </label>

                        <button className="login__button" type="submit">
                            Registrarme
                        </button>
                    </form>
                )}

                <footer className="login__footer">
                    {activeTab === 'login' ? (
                        <>¿No tienes una cuenta?
                            <button className="login__register" type="button" onClick={() => setActiveTab('register')}>
                                Regístrate aquí
                            </button>
                        </>
                    ) : (
                        <>¿Ya tienes una cuenta?
                            <button className="login__register" type="button" onClick={() => setActiveTab('login')}>
                                Inicia sesión
                            </button>
                        </>
                    )}
                </footer>
            </section>
        </main>
    );
};
