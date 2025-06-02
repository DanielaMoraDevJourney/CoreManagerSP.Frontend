import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './LayoutUsuario.css'; 

export const LayoutUsuario = () => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="layout__content">
                <Outlet />
            </main>
        </div>
    );
};
