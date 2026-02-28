import React, { createContext, useContext } from 'react';

/**
 * Lightweight auth context — no login required on a personal device.
 * The app is always "ready" and every feature is accessible immediately.
 * Kept as a context so consuming components need zero changes in their import path.
 */

interface AuthContextType {
    isReady: boolean;
}

const AuthContext = createContext<AuthContextType>({ isReady: true });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => (
    <AuthContext.Provider value={{ isReady: true }}>
        {children}
    </AuthContext.Provider>
);
