import React from 'react';
import { Alert } from 'antd';
import ProductTable from '../../components/Product/ProductTable/ProductTable';
import SectionHeader from './SectionHeader';
import { useSectionPage } from './useSectionPage';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';

const SectionPage: React.FC = () => {
    const { sectionConfig, products, loading, error, handleAddProduct } = useSectionPage();

    return !sectionConfig ? (
        <Alert
            type="error"
            message="قسم غير موجود"
            description="الرجاء الرجوع للصفحة الرئيسية"
            style={{ fontFamily: 'Cairo, sans-serif' }}
        />
    ) : (
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
                <LoadingSkeleton.Table />
            ) : (
                <ProductTable products={products} loading={loading} />
            )}
        </div>
    );
};

export default SectionPage;
