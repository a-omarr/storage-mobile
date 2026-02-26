import React from 'react';
import { Typography } from 'antd';
import { FiSearch, FiMeh } from 'react-icons/fi';
import { useProducts } from '../../hooks/useProducts';
import { useSearch } from '../../hooks/useSearch';
import ProductTable from '../../components/Product/ProductTable/ProductTable';
import SearchResultsHeader from './SearchResultsHeader';

const { Text } = Typography;

const SearchResultsPage: React.FC = () => {
    const { products, loading } = useProducts();
    const { query, setQuery, results } = useSearch(products);

    return (
        <div>
            <SearchResultsHeader query={query} setQuery={setQuery} />

            {!query ? (
                <div className="text-center py-[60px] text-[#6b7c93]">
                    <FiSearch className="text-[50px] mb-3 mx-auto" />
                    <Text style={{ fontSize: 16, fontFamily: 'Cairo, sans-serif' }}>
                        ابدأ بالكتابة للبحث عن منتج في جميع الأقسام
                    </Text>
                </div>
            ) : results.length === 0 ? (
                <div className="text-center py-[60px] text-[#6b7c93]">
                    <FiMeh className="text-[50px] mb-3 mx-auto" />
                    <Text style={{ fontSize: 16, fontFamily: 'Cairo, sans-serif' }}>
                        لم يُعثر على أي منتج مطابق لـ "{query}"
                    </Text>
                </div>
            ) : (
                <div>
                    <Text style={{
                        color: 'var(--color-text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: 13,
                        marginBottom: 12,
                        display: 'block',
                    }}>
                        تم العثور على {results.length} نتيجة
                    </Text>
                    <ProductTable products={results} loading={loading} showSection />
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
