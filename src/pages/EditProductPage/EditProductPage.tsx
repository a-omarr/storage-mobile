import React from 'react';
import { Alert, Card } from 'antd';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import ProductForm from '../../components/Product/ProductForm/ProductForm';
import EditProductHeader from './EditProductHeader';
import { useEditProduct } from './useEditProduct';

const EditProductPage: React.FC = () => {
    const {
        product, loading, saving, error,
        sectionConfig, initialValues, handleSubmit, handleCancel
    } = useEditProduct();

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

    return (
        <div>
            <EditProductHeader
                gradient={sectionConfig?.gradient || 'linear-gradient(135deg, #1677ff, #0958d9)'}
                productName={`${product.type} ${product.capacity}`}
                onCancel={handleCancel}
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
