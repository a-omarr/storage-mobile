import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Spin, Alert } from 'antd';
import { FiPlus } from 'react-icons/fi';
import type { SectionKey } from '../types/product';
import { SECTION_MAP } from '../constants/sections';
import { useSection } from '../hooks/useSection';
import ProductTable from '../components/Product/ProductTable/ProductTable';

const { Title, Text } = Typography;

const SectionPage: React.FC = () => {
    const { section } = useParams<{ section: SectionKey }>();
    const navigate = useNavigate();
    const sectionKey = section as SectionKey;
    const sectionConfig = sectionKey ? SECTION_MAP[sectionKey] : null;

    const { products, loading, error } = useSection(sectionKey || null);

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
            {/* Section Header */}
            <div
                className="rounded-[12px] px-6 py-5 mb-5 flex justify-between items-center"
                style={{ background: sectionConfig.gradient }}
            >
                <div>
                    <Title level={3} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                        {sectionConfig.label}
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Cairo, sans-serif' }}>
                        {loading ? '...' : `${products.length} منتج`}
                    </Text>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={<FiPlus />}
                    onClick={() => navigate(`/add?section=${sectionKey}`)}
                    style={{
                        background: 'rgba(255,255,255,0.25)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        borderRadius: 12,
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 600,
                    }}
                >
                    إضافة منتج
                </Button>
            </div>

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
