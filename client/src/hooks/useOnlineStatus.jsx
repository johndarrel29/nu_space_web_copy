import { useState, useEffect } from 'react';

export default function useOnlineStatus({ syncWithReactQuery = true } = {}) {
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

    useEffect(() => {
        const updateStatus = () => setIsOnline(navigator.onLine);

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        // Initial check (some browsers delay navigator.onLine updates)
        updateStatus();

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    // Optional: wire into React Query (lazy import to avoid circular deps if any)
    useEffect(() => {
        if (!syncWithReactQuery) return;
        let onlineManager;
        try {
            const rq = require('@tanstack/react-query');
            onlineManager = rq.onlineManager;
        } catch {
            return;
        }
        onlineManager?.setOnline(isOnline);
    }, [isOnline, syncWithReactQuery]);

    return isOnline;
}