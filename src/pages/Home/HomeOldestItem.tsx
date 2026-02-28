import React from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { SECTIONS } from '../../constants/sections';
import { formatDate, daysOld } from '../../utils/dateHelpers';

const { Text } = Typography;

interface Props {
    product: Product;
}

const HomeOldestItem: React.FC<Props> = ({ product: p }) => {
    const navigate = useNavigate();
    const days = daysOld(p.dateOfProduction);
    const firstSectionKey = p.sections?.[0];
    const section = SECTIONS.find((s) => s.key === firstSectionKey);

    return (
        <div
            onClick={() => navigate(`/product/${p.id}`)}
            className="flex justify-between items-center cursor-pointer px-3 py-2 bg-white rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        >
            <div>
                <Text strong style={{ fontFamily: 'Cairo, sans-serif', display: 'block', fontSize: 14 }}>
                    {p.type} {p.capacity}
                </Text>
                <Text style={{ color: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'Cairo, sans-serif' }}>
                    {section?.label} · {p.batchNumber}
                </Text>
            </div>
            <div className="text-left">
                <Text style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'Cairo, sans-serif', display: 'block' }}>
                    {formatDate(p.dateOfProduction)}
                </Text>
                <span className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] rounded-lg px-2.5 py-1 text-xs text-[#92400e] font-semibold">
                    {days} يوم
                </span>
            </div>
        </div>
    );
};

export default HomeOldestItem;
