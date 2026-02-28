import React from 'react';
import { Alert } from 'antd';
import ProductCard from '../../components/Product/ProductCard/ProductCard';
import { useProductDetail } from './useProductDetail';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';

const ProductDetailPage: React.FC = () => {
    const { product, loading, error } = useProductDetail();

    return loading ? (
        <LoadingSkeleton.Detail />
    ) : (error || !product) ? (
        <Alert
            type="error"
            message={error || 'منتج غير موجود'}
            style={{ fontFamily: 'Cairo, sans-serif' }}
        />
    ) : (
        <ProductCard product={product} />
    );
};

export default ProductDetailPage;
