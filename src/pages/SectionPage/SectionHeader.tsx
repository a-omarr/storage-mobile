import React from 'react';
import { Button, Typography } from 'antd';
import { FiPlus } from 'react-icons/fi';

const { Title, Text } = Typography;

interface Props {
    label: string;
    gradient: string;
    count: number;
    loading: boolean;
    onAddProduct: () => void;
}

const SectionHeader: React.FC<Props> = ({ label, gradient, count, loading, onAddProduct }) => (
    <div
        className="rounded-[12px] px-6 py-5 mb-5 flex justify-between items-center"
        style={{ background: gradient }}
    >
        <div>
            <Title level={3} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                {label}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Cairo, sans-serif' }}>
                {loading ? '...' : `${count} منتج`}
            </Text>
        </div>
        <Button
            type="primary"
            size="large"
            icon={<FiPlus />}
            onClick={onAddProduct}
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
);

export default SectionHeader;
