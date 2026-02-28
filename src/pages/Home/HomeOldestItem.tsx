import React from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
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

    // Determine urgency color
    const getUrgencyColor = (d: number) => {
        if (d > 30) return { border: '#ef4444', bg: '#fee2e2', text: '#991b1b' }; // Red
        if (d > 14) return { border: '#f59e0b', bg: '#fef3c7', text: '#92400e' }; // Orange
        if (d > 7) return { border: '#eab308', bg: '#fef9c3', text: '#854d0e' };  // Yellow
        return { border: '#3b82f6', bg: '#dbeafe', text: '#1e40af' };           // Blue
    };

    const colors = getUrgencyColor(days);

    return (
        <div
            onClick={() => navigate(`/product/${p.id}`)}
            className="group relative flex flex-col justify-between cursor-pointer bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300 w-[200px] h-[140px] p-4 overflow-hidden border-0 border-r-4"
            style={{ borderRightColor: colors.border }}
        >
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start mb-1">
                    <span
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                        {days} يوم
                    </span>
                    <Text style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'Cairo, sans-serif' }}>
                        {formatDate(p.dateOfProduction)}
                    </Text>
                </div>
                <Text strong className="line-clamp-1" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 15, marginBottom: -2 }}>
                    {p.type}
                </Text>
                <Text style={{ color: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'Cairo, sans-serif' }}>
                    {p.capacity}
                </Text>
            </div>

            <div className="flex items-center justify-between mt-2">
                <div
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: section?.bgColor || '#f1f5f9', color: section?.color || '#475569', border: `1px solid ${section?.color}20` }}
                >
                    {section?.label || 'بدون قسم'}
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FiChevronLeft size={16} />
                </div>
            </div>
        </div>
    );
};

export default HomeOldestItem;
