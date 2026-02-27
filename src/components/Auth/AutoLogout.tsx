import React, { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../firebase/AuthContext';
import { message } from 'antd';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const ACTIVITY_THROTTLE_MS = 5000;

interface Props {
    children: React.ReactNode;
}

const AutoLogout: React.FC<Props> = ({ children }) => {
    const { user, logout } = useAuth();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!user) return;

        timerRef.current = setTimeout(async () => {
            try {
                message.warning('تم تسجيل الخروج تلقائياً بسبب عدم النشاط');
                await new Promise(res => setTimeout(res, 800));
                await logout();
            } catch (error) {
                console.error('Auto-logout failed:', error);
            }
        }, INACTIVITY_TIMEOUT_MS);
    }, [user, logout]);

    const handleUserActivity = useCallback(() => {
        const now = Date.now();
        if (now - lastActivityRef.current > ACTIVITY_THROTTLE_MS) {
            lastActivityRef.current = now;
            resetTimer();
        }
    }, [resetTimer]);

    useEffect(() => {
        if (!user) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        resetTimer();

        const events = [
            'mousedown', 'mousemove', 'keydown',
            'keypress', 'click', 'scroll',
            'touchstart', 'touchmove',
        ];

        events.forEach(e => window.addEventListener(e, handleUserActivity));

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(e => window.removeEventListener(e, handleUserActivity));
        };
    }, [user, resetTimer, handleUserActivity]);

    return <>{children}</>;
};

export default AutoLogout;