import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Spin, Button, Input } from 'antd';
import { FiArrowRight, FiArrowUp, FiArrowDown, FiClock, FiSearch } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import { SECTION_MAP } from '../constants/sections';
import { formatDate, daysOld } from '../utils/dateHelpers';

const { Title, Text } = Typography;

const AllProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const { products, loading } = useProducts();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = products.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.type.toLowerCase().includes(term) ||
            p.batchNumber.toLowerCase().includes(term) ||
            (SECTION_MAP[p.section]?.label || '').toLowerCase().includes(term)
        );
    });

    const sorted = [...filtered]
        .filter((p) => p.dateOfProduction)
        .sort((a, b) => {
            const ta = a.dateOfProduction.toMillis();
            const tb = b.dateOfProduction.toMillis();
            return sortOrder === 'asc' ? ta - tb : tb - ta;
        });

    return (
        <div className="pb-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[12px] px-6 py-5 mb-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
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

                {/* Search Bar */}
                <div className="relative">
                    <Input
                        placeholder="ابحث عن منتج، رمز تشغيلة، أو قسم..."
                        prefix={<FiSearch className="text-blue-400 ml-2" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 rounded-xl border-none shadow-inner"
                        style={{
                            fontFamily: 'Cairo, sans-serif',
                            direction: 'rtl'
                        }}
                    />
                </div>
            </div>

            {/* Product list */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Spin size="large" />
                </div>
            ) : sorted.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <FiSearch className="text-[50px] mx-auto mb-3 opacity-20" />
                    <Text style={{ fontFamily: 'Cairo, sans-serif', fontSize: 16, color: '#94a3b8' }}>
                        {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد منتجات مضافة بعد'}
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
                                    <Text
                                        style={{
                                            color: isOld ? '#ef4444' : '#1e293b',
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
                                            ? 'bg-rose-50 border border-rose-200 text-rose-700'
                                            : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
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

