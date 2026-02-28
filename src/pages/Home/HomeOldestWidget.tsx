import React from 'react';
import { Typography } from 'antd';
import { FiAlertTriangle, FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import HomeOldestItem from './HomeOldestItem';

const { Title } = Typography;

interface Props {
    oldest: Product[];
}

const HomeOldestWidget: React.FC<Props> = ({ oldest }) => {
    const navigate = useNavigate();

    return oldest.length === 0 ? null : (
        <div className="mb-2">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <FiAlertTriangle style={{ color: '#f59e0b', fontSize: 18 }} />
                    </div>
                    <Title level={4} style={{ margin: 0, fontFamily: 'Cairo, sans-serif', fontSize: 18 }}>
                        أقدم المنتجات
                    </Title>
                </div>
                <button
                    onClick={() => navigate('/all-products')}
                    className="flex items-center gap-1 text-blue-600 text-sm font-bold font-['Cairo',sans-serif] bg-transparent border-0 cursor-pointer hover:text-blue-700 transition-colors"
                >
                    عرض الكل
                    <FiChevronLeft size={16} />
                </button>
            </div>

            <div
                className="flex gap-4 overflow-x-auto pb-4 px-1 -mx-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollSnapType: 'x proximity' }}
            >
                {oldest.map((p) => (
                    <div key={p.id} style={{ scrollSnapAlign: 'start' }}>
                        <HomeOldestItem product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeOldestWidget;
