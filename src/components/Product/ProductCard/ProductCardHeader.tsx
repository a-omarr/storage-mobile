import React from 'react';
import { Space, Button, Tag, Typography } from 'antd';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Product, SectionKey } from '../../../types/product';
import { SECTION_MAP } from '../../../constants/sections';

const { Title, Text } = Typography;

interface Props {
    product: Product;
}

const ProductCardHeader: React.FC<Props> = ({ product }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const urlSection = searchParams.get('section');
    const validUrlSection = urlSection && product.sections?.includes(urlSection as SectionKey) ? urlSection : undefined;

    const firstSectionKey = (validUrlSection || product.sections?.[0]) as keyof typeof SECTION_MAP | undefined;
    const section = firstSectionKey ? SECTION_MAP[firstSectionKey] : undefined;

    return (
        <div
            className="px-6 py-5 text-white"
            style={{ background: section?.gradient || '#1677ff' }}
        >
            <Space style={{ marginBottom: 4 }}>
                <Button
                    type="text"
                    icon={<FiArrowRight />}
                    onClick={() => navigate(-1)}
                    style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}
                />
                <Tag
                    style={{
                        background: 'rgba(255,255,255,0.25)',
                        border: 'none',
                        color: 'white',
                        fontWeight: 600,
                        fontFamily: 'Cairo, sans-serif',
                    }}
                >
                    {section?.label || firstSectionKey || 'غير محدد'}
                </Tag>
            </Space>
            <Title level={3} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                {product.type} — {product.capacity}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Cairo, sans-serif' }}>
                دفعة: {product.batchNumber}
            </Text>
        </div>
    );
};

export default ProductCardHeader;
