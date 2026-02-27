import React from 'react';
import type { Product } from '../../../types/product';
import { useProductSort } from './useProductSort';
import ProductDesktopTable from './ProductDesktopTable';
import ProductMobileList from './ProductMobileList';

interface Props {
    products: Product[];
    loading?: boolean;
    showSection?: boolean;
}

const ProductTable: React.FC<Props> = ({
    products,
    loading = false,
    showSection = false,
}) => {
    const { sorted, sortOrder, toggleSort } = useProductSort(products);

    return (
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <ProductDesktopTable
                products={sorted}
                loading={loading}
                showSection={showSection}
                sortOrder={sortOrder}
                toggleSort={toggleSort}
            />
            <ProductMobileList
                products={sorted}
                loading={loading}
                showSection={showSection}
                sortOrder={sortOrder}
                toggleSort={toggleSort}
            />
        </div>
    );
};

export default ProductTable;
