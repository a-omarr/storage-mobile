import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Spin, Alert } from 'antd';
import { FiPlus } from 'react-icons/fi';
import type { SectionKey } from '../types/product';
import { SECTION_MAP } from '../constants/sections';
import { useSection } from '../hooks/useSection';
import ProductTable from '../components/Product/ProductTable';

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
                style={{
                    background: sectionConfig.gradient,
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 24px',
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
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
                <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <ProductTable products={products} loading={loading} />
            )}
        </div>
    );
};

export default SectionPage;
