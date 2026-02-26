import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Spin, Button } from 'antd';
import { FiArrowRight, FiArrowUp, FiArrowDown, FiClock } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import { SECTION_MAP } from '../constants/sections';
import { formatDate, daysOld } from '../utils/dateHelpers';

const { Title, Text } = Typography;

const AllProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const { products, loading } = useProducts();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const sorted = [...products]
        .filter((p) => p.dateOfProduction)
        .sort((a, b) => {
            const ta = a.dateOfProduction.toMillis();
            const tb = b.dateOfProduction.toMillis();
            return sortOrder === 'asc' ? ta - tb : tb - ta;
        });

    return (
        <div>
            {/* Header */}
            <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-[12px] px-6 py-4 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center text-white border-0 cursor-pointer shrink-0"
                    >
                        <FiArrowRight size={18} />
                    </button>
                    <div>
                        <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                            <FiClock className="inline ml-2" />
                            المنتجات حسب تاريخ الإنتاج
                        </Title>
                        {!loading && (
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                                {sorted.length} منتج
                            </Text>
                        )}
                    </div>
                </div>

                {/* Sort toggle */}
                <Button
                    onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        color: 'white',
                        fontFamily: 'Cairo, sans-serif',
                        borderRadius: 10,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                    }}
                    icon={sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                >
                    {sortOrder === 'asc' ? 'الأقدم أولاً' : 'الأحدث أولاً'}
                </Button>
            </div>

            {/* Product list */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Spin size="large" />
                </div>
            ) : sorted.length === 0 ? (
                <div className="text-center py-16 text-[#6b7c93]">
                    <FiClock className="text-[50px] mx-auto mb-3" />
                    <Text style={{ fontFamily: 'Cairo, sans-serif', fontSize: 16 }}>
                        لا توجد منتجات مضافة بعد
                    </Text>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {sorted.map((p) => {
                        const days = daysOld(p.dateOfProduction);
                        const isOld = days > 365;
                        const section = SECTION_MAP[p.section];
                        return (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/product/${p.id}`)}
                                className="bg-white rounded-[12px] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-2 border-transparent hover:border-[#f59e0b] hover:shadow-[0_4px_12px_rgba(245,158,11,0.15)] transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
                            >
                                {/* Section badge + product name */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-sm shrink-0 font-['Cairo',sans-serif]"
                                        style={{ background: section?.gradient || '#1677ff' }}
                                    >
                                        {p.section === 'THE_SIXTH' ? 'س' : p.section === 'EYES' ? 'ع' : p.section}
                                    </div>
                                    <div className="min-w-0">
                                        <Text strong style={{ fontFamily: 'Cairo, sans-serif', fontSize: 15, display: 'block' }}>
                                            {p.type} — {p.capacity}
                                        </Text>
                                        <Text style={{ color: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'Cairo, sans-serif' }}>
                                            {section?.label} · {p.batchNumber}
                                        </Text>
                                    </div>
                                </div>

                                {/* Date + age badge */}
                                <div className="text-left shrink-0">
                                    <Text
                                        style={{
                                            color: isOld ? '#ef4444' : 'var(--color-text)',
                                            fontWeight: isOld ? 700 : 500,
                                            fontFamily: 'Cairo, sans-serif',
                                            fontSize: 13,
                                            display: 'block',
                                        }}
                                    >
                                        {formatDate(p.dateOfProduction)}
                                    </Text>
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isOld
                                                ? 'bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] text-[#92400e]'
                                                : 'bg-[#f0fdf4] border border-[#86efac] text-[#166534]'
                                            }`}
                                    >
                                        {days} يوم
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllProductsPage;
