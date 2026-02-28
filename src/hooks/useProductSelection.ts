import { useState, useCallback } from 'react';

export const useProductSelection = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(currentId => currentId !== id) : [...prev, id]
        );
    }, []);

    const toggleAll = useCallback((ids: string[]) => {
        setSelectedIds(prev => (prev.length === ids.length ? [] : ids));
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    return {
        selectedIds,
        setSelectedIds,
        toggleSelection,
        toggleAll,
        clearSelection
    };
};
