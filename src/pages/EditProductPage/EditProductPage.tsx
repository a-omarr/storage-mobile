import React from 'react';
import { Spin, Alert, Card } from 'antd';
import ProductForm from '../../components/Product/ProductForm/ProductForm';
import EditProductHeader from './EditProductHeader';
import { useEditProduct } from './useEditProduct';

const EditProductPage: React.FC = () => {
    const {
        product, loading, saving, error,
        sectionConfig, initialValues, handleSubmit
    } = useEditProduct();

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

    return (
        <div>
            <EditProductHeader
                gradient={sectionConfig?.gradient || 'linear-gradient(135deg, #1677ff, #0958d9)'}
                productName={`${product.type} ${product.capacity}`}
            />
            <Card
                style={{
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    border: 'none',
                }}
                bodyStyle={{ padding: '24px' }}
            >
                <ProductForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    loading={saving}
                    isEdit
                />
            </Card>
        </div>
    );
};

export default EditProductPage;
