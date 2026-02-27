import React, { useState, useEffect } from 'react';
import { WifiOutlined } from '@ant-design/icons';

const OfflineIndicator: React.FC = () => {
    const [isOffline, setIsOffline] = useState(!window.navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[2000] animate-in slide-in-from-top duration-300">
            <div className="bg-[#ef4444] text-white px-4 py-2 flex items-center justify-center gap-2 shadow-md">
                <WifiOutlined className="animate-pulse" />
                <span className="font-['Cairo',sans-serif] text-sm font-bold">
                    أنت غير متصل — سيتم المزامنة عند عودة الاتصال
                </span>
            </div>
        </div>
    );
};

export default OfflineIndicator;
