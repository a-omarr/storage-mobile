import React, { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../firebase/AuthContext';
import { message } from 'antd';

// Set inactivity timeout (e.g., 30 minutes)
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

interface Props {
    children: React.ReactNode;
}

const AutoLogout: React.FC<Props> = ({ children }) => {
    const { user, logout } = useAuth();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (user) {
            timerRef.current = setTimeout(async () => {
                try {
                    await logout();
                    message.warning('تم تسجيل الخروج تلقائياً بسبب عدم النشاط');
                } catch (error) {
                    console.error('Auto-logout failed:', error);
                }
            }, INACTIVITY_TIMEOUT_MS);
        }
    }, [user, logout]);

    useEffect(() => {
        // Only set up listeners if the user is logged in
        if (!user) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            return;
        }

        // Initialize the timer
        resetTimer();

        // Events that reset the inactivity timer
        const events = [
            'mousedown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart'
        ];

        const handleUserActivity = () => {
            resetTimer();
        };

        // Attach event listeners
        events.forEach((event) => {
            window.addEventListener(event, handleUserActivity);
        });

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, handleUserActivity);
            });
        };
    }, [user, resetTimer]);

    return <>{children}</>;
};

export default AutoLogout;
