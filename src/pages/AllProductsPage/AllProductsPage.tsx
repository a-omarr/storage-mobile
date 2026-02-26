import React from 'react';
import { Spin, Typography } from 'antd';
import { FiSearch } from 'react-icons/fi';
import { useAllProducts } from './useAllProducts';
import AllProductsHeader from './AllProductsHeader';
import AllProductsItem from './AllProductsItem';

const { Text } = Typography;

const AllProductsPage: React.FC = () => {
    const { sorted, loading, sortOrder, toggleSort, searchTerm, setSearchTerm } = useAllProducts();

    return (
        <div className="pb-10">
            <AllProductsHeader
                total={sorted.length}
                loading={loading}
                sortOrder={sortOrder}
                toggleSort={toggleSort}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

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
                    {sorted.map((p) => (
                        <AllProductsItem key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllProductsPage;
