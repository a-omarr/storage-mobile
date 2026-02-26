import React from 'react';
import { Spin, Alert } from 'antd';
import ProductCard from '../../components/Product/ProductCard/ProductCard';
import { useProductDetail } from './useProductDetail';

const ProductDetailPage: React.FC = () => {
    const { product, loading, error } = useProductDetail();

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spin size="large" />
            </div>
        );
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
