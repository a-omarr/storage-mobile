import React from 'react';
import type { Product } from '../../../types/product';
import ProductMobileCard from './ProductMobileCard';
import ProductEmptyState from './ProductEmptyState';

interface Props {
    products: Product[];
    loading: boolean;
    showSection: boolean;
}

const ProductMobileList: React.FC<Props> = ({ products, loading, showSection }) => (
    <div className="md:hidden">
        {!loading && products.length === 0 && <ProductEmptyState />}
        {products.map((record) => (
            <ProductMobileCard key={record.id} record={record} showSection={showSection} />
        ))}
    </div>
);

export default ProductMobileList;
