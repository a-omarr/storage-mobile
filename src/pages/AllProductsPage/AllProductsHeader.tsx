import React from 'react';
import { Button, Input, Typography } from 'antd';
import { FiArrowRight, FiArrowUp, FiArrowDown, FiClock, FiSearch, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface Props {
    total: number;
    loading: boolean;
    sortOrder: 'asc' | 'desc';
    toggleSort: () => void;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    onSelectAll: () => void;
    allSelected: boolean;
    hasItems: boolean;
}

const AllProductsHeader: React.FC<Props> = ({
    total, loading, sortOrder, toggleSort, searchTerm, setSearchTerm, onSelectAll, allSelected, hasItems
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[12px] px-6 py-5 mb-5 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
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
                                {total} منتج
                            </Text>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                    {hasItems && (
                        <Button
                            onClick={onSelectAll}
                            icon={allSelected ? <FiCheckSquare /> : <FiSquare />}
                            style={{
                                background: allSelected ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.2)',
                                border: `1px solid ${allSelected ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.4)'}`,
                                color: 'white',
                                fontFamily: 'Cairo, sans-serif',
                                borderRadius: 10,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            {allSelected ? 'إلغاء التحديد' : 'تحديد الكل'}
                        </Button>
                    )}
                    <Button
                        onClick={toggleSort}
                        icon={sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
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
                    >
                        {sortOrder === 'asc' ? 'الأقدم أولاً' : 'الأحدث أولاً'}
                    </Button>
                </div>
            </div>

            <Input
                placeholder="ابحث عن منتج، رمز تشغيلة، أو قسم..."
                prefix={<FiSearch className="text-blue-400 ml-2" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-xl border-none shadow-inner"
                style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}
            />
        </div>
    );
};

export default AllProductsHeader;
