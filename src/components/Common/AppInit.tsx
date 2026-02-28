import React, { useEffect, useState } from 'react';
import { getDB } from '../../db/database';

interface AppInitProps {
    children: React.ReactNode;
}

/**
 * Initializes the SQLite database before rendering the app.
 * On web: jeep-sqlite element must be in index.html.
 * On Android/iOS: uses native SQLite directly.
 */
const AppInit: React.FC<AppInitProps> = ({ children }) => {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDB()
            .then(() => setReady(true))
            .catch((err) => {
                console.error('DB init error:', err);
                setError(String(err));
            });
    }, []);

    if (error) {
        return (
            <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>
                <p>خطأ في تهيئة قاعدة البيانات:</p>
                <pre style={{ fontSize: 12 }}>{error}</pre>
            </div>
        );
    }

    if (!ready) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontSize: 18,
                color: '#1677ff',
            }}>
                جاري التحميل...
            </div>
        );
    }

    return <>{children}</>;
};

export default AppInit;
