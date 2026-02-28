import React, { createContext, useContext, useState, useEffect } from 'react';
import * as pinAuth from '../services/pinAuth';
import { getDB } from '../db/database';

interface AuthContextType {
    isReady: boolean;
    isPinSet: boolean;
    isUnlocked: boolean;
    unlock: (pin: string) => Promise<boolean>;
    setupPin: (pin: string) => Promise<void>;
    lock: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [isPinSet, setIsPinSet] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                // Ensure DB is initialized first
                await getDB();
                const set = await pinAuth.isPinSet();
                setIsPinSet(set);
                setIsReady(true);
            } catch (err) {
                console.error('Auth initialization error:', err);
                setIsReady(true); // Proceed anyway
            }
        };
        init();
    }, []);

    const unlock = async (pin: string) => {
        const success = await pinAuth.verifyPin(pin);
        if (success) {
            setIsUnlocked(true);
        }
        return success;
    };

    const setupPin = async (pin: string) => {
        await pinAuth.setPin(pin);
        setIsPinSet(true);
        setIsUnlocked(true);
    };

    const lock = () => {
        setIsUnlocked(false);
    };

    return (
        <AuthContext.Provider value={{ isReady, isPinSet, isUnlocked, unlock, setupPin, lock }}>
            {children}
        </AuthContext.Provider>
    );
};
