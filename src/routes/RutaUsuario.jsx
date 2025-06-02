import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const RutaUsuario = ({ children }) => {
    const { userData } = useAuth();

    const role = userData?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return role === 'Usuario' ? <>{children}</> : <Navigate to="/" />;
};
