import React from 'react';
import { Card, Typography } from 'antd';
import { FiAlertTriangle, FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import HomeOldestItem from './HomeOldestItem';

const { Text } = Typography;

interface Props {
    oldest: Product[];
}

const HomeOldestWidget: React.FC<Props> = ({ oldest }) => {
    const navigate = useNavigate();

    if (oldest.length === 0) return null;

    return (
        <Card
            style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid #fde68a',
                background: '#fffbeb',
                boxShadow: 'var(--shadow-sm)',
            }}
            bodyStyle={{ padding: '16px 20px' }}
        >
            <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                    <FiAlertTriangle style={{ color: '#f59e0b', fontSize: 20 }} />
                    <Text strong style={{ fontFamily: 'Cairo, sans-serif', fontSize: 15, color: '#92400e' }}>
                        أقدم المنتجات — يحتاج تصريف
                    </Text>
                </div>
                <button
                    onClick={() => navigate('/all-products')}
                    className="flex items-center gap-1 text-[#f59e0b] text-sm font-semibold font-['Cairo',sans-serif] bg-transparent border-0 cursor-pointer hover:text-[#d97706] transition-colors"
                >
                    عرض الكل
                    <FiChevronLeft size={16} />
                </button>
            </div>
            <div className="flex flex-col gap-2.5">
                {oldest.map((p) => (
                    <HomeOldestItem key={p.id} product={p} />
                ))}
            </div>
        </Card>
    );
};

export default HomeOldestWidget;
