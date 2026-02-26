import React from 'react';
import { Typography } from 'antd';
import { useProducts } from '../hooks/useProducts';
import { useSearch } from '../hooks/useSearch';
import SearchBar from '../components/Search/SearchBar';
import ProductTable from '../components/Product/ProductTable';

const { Title, Text } = Typography;

const SearchResultsPage: React.FC = () => {
    const { products, loading } = useProducts();
    const { query, setQuery, results } = useSearch(products);

    return (
        <div>
            {/* Header */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #1677ff, #0958d9)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 24px',
                    marginBottom: 20,
                }}
            >
                <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif', marginBottom: 12 }}>
                    🔍 البحث في المخزن
                </Title>
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="ابحث بالنوع، اللون، رقم الصنف، رقم الدفعة..."
                />
            </div>

            {/* Results */}
            {!query ? (
                <div
                    style={{
                        textAlign: 'center',
                        padding: 60,
                        color: 'var(--color-text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                    }}
                >
                    <div style={{ fontSize: 50, marginBottom: 12 }}>🔍</div>
                    <Text style={{ fontSize: 16, fontFamily: 'Cairo, sans-serif' }}>
                        ابدأ بالكتابة للبحث عن منتج في جميع الأقسام
                    </Text>
                </div>
            ) : results.length === 0 ? (
                <div
                    style={{
                        textAlign: 'center',
                        padding: 60,
                        color: 'var(--color-text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                    }}
                >
                    <div style={{ fontSize: 50, marginBottom: 12 }}>😕</div>
                    <Text style={{ fontSize: 16, fontFamily: 'Cairo, sans-serif' }}>
                        لم يُعثر على أي منتج مطابق لـ "{query}"
                    </Text>
                </div>
            ) : (
                <div>
                    <Text
                        style={{
                            color: 'var(--color-text-muted)',
                            fontFamily: 'Cairo, sans-serif',
                            fontSize: 13,
                            marginBottom: 12,
                            display: 'block',
                        }}
                    >
                        تم العثور على {results.length} نتيجة
                    </Text>
                    <ProductTable products={results} loading={loading} showSection />
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
