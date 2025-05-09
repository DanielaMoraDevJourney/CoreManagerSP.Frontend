import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { userData } = useAuth();
    const role = userData?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const isUsuario = role === 'Usuario';
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // o removeItem('token') si usas uno específico
        navigate('/');
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar__top">
                <button
                    className="sidebar__toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? "Abrir menú" : "Cerrar menú"}
                >
                    {collapsed ? (
                        <svg viewBox="0 0 100 80" width="26" height="26">
                            <rect width="100" height="10" rx="5" fill="white"></rect>
                            <rect y="30" width="100" height="10" rx="5" fill="white"></rect>
                            <rect y="60" width="100" height="10" rx="5" fill="white"></rect>
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="26" height="26">
                            <line x1="4" y1="4" x2="20" y2="20" stroke="white" strokeWidth="2" />
                            <line x1="20" y1="4" x2="4" y2="20" stroke="white" strokeWidth="2" />
                        </svg>
                    )}
                </button>

                {!collapsed && <h2>Panel Usuario</h2>}

                {!collapsed && (
                    <div className="sidebar__role">
                        <p><strong>Rol:</strong> {role}</p>
                    </div>
                )}

                {isUsuario && (
                    <nav className="sidebar__nav">
                        <NavLink to="/solicitud">Solicitud</NavLink>
                        <NavLink to="/historial">Historial</NavLink>
                        <NavLink to="/comparar">Comparar</NavLink>
                        <NavLink to="/mejoras">Mejoras</NavLink>

                        <hr className="sidebar__divider" />

                        <button className="sidebar__logout-link" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    </nav>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
