import React from 'react';
import { Spin, Alert } from 'antd';
import ProductTable from '../../components/Product/ProductTable/ProductTable';
import SectionHeader from './SectionHeader';
import { useSectionPage } from './useSectionPage';

const SectionPage: React.FC = () => {
    const { sectionConfig, products, loading, error, handleAddProduct } = useSectionPage();

    if (!sectionConfig) {
        return (
            <Alert
                type="error"
                message="قسم غير موجود"
                description="الرجاء الرجوع للصفحة الرئيسية"
                style={{ fontFamily: 'Cairo, sans-serif' }}
            />
        );
    }

    return (
        <div>
            <SectionHeader
                label={sectionConfig.label}
                gradient={sectionConfig.gradient}
                count={products.length}
                loading={loading}
                onAddProduct={handleAddProduct}
            />

            {error && (
                <Alert
                    type="error"
                    message={`خطأ في تحميل البيانات: ${error}`}
                    style={{ marginBottom: 16, fontFamily: 'Cairo, sans-serif' }}
                />
            )}

            {loading ? (
                <div className="flex justify-center py-[60px]">
                    <Spin size="large" />
                </div>
            ) : (
                <ProductTable products={products} loading={loading} />
            )}
        </div>
    );
};

export default SectionPage;
