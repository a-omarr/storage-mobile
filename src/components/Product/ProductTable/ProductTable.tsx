import React from 'react';
import type { Product, SectionKey } from '../../../types/product';
import { useProductSort } from './useProductSort';
import ProductDesktopTable from './ProductDesktopTable';
import ProductMobileList from './ProductMobileList';
import { useProductSelection } from '../../../hooks/useProductSelection';
import BulkDeleteBar from './BulkDeleteBar';
import { useProductDelete } from './useProductDelete';

interface Props {
    products: Product[];
    loading?: boolean;
    showSection?: boolean;
    onRefresh?: () => void;
    currentSection?: SectionKey;
}

const ProductTable: React.FC<Props> = ({
    products,
    loading = false,
    showSection = false,
    onRefresh,
    currentSection,
}) => {
    const { sorted, sortOrder, toggleSort } = useProductSort(products);
    const { selectedIds, toggleSelection, toggleAll, clearSelection } = useProductSelection();
    const { handleBulkDelete } = useProductDelete();

    const handleRefresh = () => {
        clearSelection();
        onRefresh?.();
    };

    const onBulkDelete = async () => {
        const success = await handleBulkDelete(selectedIds, { onRefresh: handleRefresh, currentSection });
        if (success) {
            clearSelection();
        }
    };

    return (
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden relative">
            <ProductDesktopTable
                products={sorted}
                loading={loading}
                showSection={showSection}
                sortOrder={sortOrder}
                toggleSort={toggleSort}
                selectedIds={selectedIds}
                toggleSelection={toggleSelection}
                toggleAll={toggleAll}
                onRefresh={handleRefresh}
                currentSection={currentSection}
            />
            <ProductMobileList
                products={sorted}
                loading={loading}
                showSection={showSection}
                sortOrder={sortOrder}
                toggleSort={toggleSort}
                selectedIds={selectedIds}
                toggleSelection={toggleSelection}
                toggleAll={toggleAll}
                onRefresh={handleRefresh}
                currentSection={currentSection}
            />

            <BulkDeleteBar
                selectedCount={selectedIds.length}
                onDelete={onBulkDelete}
                onCancel={clearSelection}
            />
        </div>
    );
};

export default ProductTable;
