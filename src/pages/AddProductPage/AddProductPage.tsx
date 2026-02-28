import React from 'react';
import { Card } from 'antd';
import ProductForm from '../../components/Product/ProductForm/ProductForm';
import AddProductHeader from './AddProductHeader';
import { useAddProduct } from './useAddProduct';

const AddProductPage: React.FC = () => {
    const { loading, defaultSection, sectionConfig, handleCancel, handleSubmit } = useAddProduct();

    return (
        <div>
            <AddProductHeader
                gradient={sectionConfig?.gradient || 'linear-gradient(135deg, #1677ff, #0958d9)'}
                sectionLabel={sectionConfig?.label}
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
                    defaultSections={defaultSection ? [defaultSection] : undefined}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default AddProductPage;
