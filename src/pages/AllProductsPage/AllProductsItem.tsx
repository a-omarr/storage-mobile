import React from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { SECTION_MAP } from '../../constants/sections';
import { formatDate, daysOld } from '../../utils/dateHelpers';

const { Text } = Typography;

interface Props {
    product: Product;
}

const AllProductsItem: React.FC<Props> = ({ product: p }) => {
    const navigate = useNavigate();
    const days = daysOld(p.dateOfProduction);
    const isOld = days > 365;
    const section = SECTION_MAP[p.section as keyof typeof SECTION_MAP];

    return (
        <div
            onClick={() => navigate(`/product/${p.id}`)}
            className="bg-white rounded-[12px] px-5 py-4 shadow-sm border-2 border-transparent hover:border-blue-500/30 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group"
        >
            {/* Section badge + product name */}
            <div className="flex items-center gap-3 min-w-0">
                <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-sm shrink-0 font-['Cairo',sans-serif] group-hover:scale-110 transition-transform"
                    style={{ background: section?.gradient || '#2563eb' }}
                >
                    {p.section === 'THE_SIXTH' ? 'س' : p.section === 'EYES' ? 'ع' : p.section}
                </div>
                <div className="min-w-0">
                    <Text strong style={{ fontFamily: 'Cairo, sans-serif', fontSize: 15, display: 'block' }}>
                        {p.type} — {p.capacity}
                    </Text>
                    <Text style={{ color: '#64748b', fontSize: 12, fontFamily: 'Cairo, sans-serif' }}>
                        {section?.label} · {p.batchNumber}
                    </Text>
                </div>
            </div>

            {/* Date + age badge */}
            <div className="text-left shrink-0">
                <Text style={{
                    color: isOld ? '#ef4444' : '#1e293b',
                    fontWeight: isOld ? 700 : 500,
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: 13,
                    display: 'block',
                }}>
                    {formatDate(p.dateOfProduction)}
                </Text>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isOld
                        ? 'bg-rose-50 border border-rose-200 text-rose-700'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    }`}>
                    {days} يوم
                </span>
            </div>
        </div>
    );
};

export default AllProductsItem;
