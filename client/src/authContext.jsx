import { createContext, useContext, useEffect, useState } from 'react';
import authService from './services/authService';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authService.fetchUser().then(u => {
            setUser(u);
            setLoading(false);
        }).catch(err => {
            console.error('Failed to fetch user:', err);
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}