import React from 'react';
import { Button } from 'antd';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import type { Product } from '../../../types/product';
import ProductMobileCard from './ProductMobileCard';
import ProductEmptyState from './ProductEmptyState';

interface Props {
    products: Product[];
    loading: boolean;
    showSection: boolean;
    sortOrder: 'asc' | 'desc';
    toggleSort: () => void;
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    toggleAll: (ids: string[]) => void;
}

const ProductMobileList: React.FC<Props> = ({
    products, loading, showSection, sortOrder, toggleSort,
    selectedIds, toggleSelection
}) => (
    <div className="md:hidden">
        {!loading && products.length > 0 && (
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-['Cairo',sans-serif]">
                    إجمالي {products.length} منتج
                </span>
                <Button
                    type="text"
                    onClick={toggleSort}
                    icon={sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                    className="text-blue-600 font-['Cairo',sans-serif] hover:bg-blue-50 flex items-center gap-1.5"
                >
                    {sortOrder === 'asc' ? 'الأقدم أولاً' : 'الأحدث أولاً'}
                </Button>
            </div>
        )}
        {!loading && products.length === 0 && <ProductEmptyState />}
        {products.map((record: any) => {
            const compoundKey = record.displaySection ? `${record.id}::${record.displaySection}` : record.id;
            return (
                <ProductMobileCard
                    key={compoundKey}
                    record={record}
                    showSection={showSection}
                    isSelected={selectedIds.includes(compoundKey)}
                    onToggleSelect={() => toggleSelection(compoundKey)}
                />
            );
        })}
    </div>
);

export default ProductMobileList;
