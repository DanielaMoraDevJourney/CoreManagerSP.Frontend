import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    userData: any | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<any | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setUserData(decodeToken(storedToken));
        }
    }, []);

    const login = (newToken: string) => {
        const payload = decodeToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('usuarioData', JSON.stringify(payload));
        setToken(newToken);
        setUserData(payload);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioData');
        setToken(null);
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ token, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

const decodeToken = (token: string): any | null => {
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        return JSON.parse(payloadJson);
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
};
