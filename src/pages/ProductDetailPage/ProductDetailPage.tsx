import React from 'react';
import { Alert } from 'antd';
import ProductCard from '../../components/Product/ProductCard/ProductCard';
import { useProductDetail } from './useProductDetail';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';

const ProductDetailPage: React.FC = () => {
    const { product, loading, error } = useProductDetail();

    if (loading) {
        return <LoadingSkeleton.Detail />;
    }

    if (error || !product) {
        return (
            <Alert
                type="error"
                message={error || 'منتج غير موجود'}
                style={{ fontFamily: 'Cairo, sans-serif' }}
            />
        );
    }

    return <ProductCard product={product} />;
};

export default ProductDetailPage;
