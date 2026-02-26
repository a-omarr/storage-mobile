import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Spin, Card } from 'antd';
import { FiAlertTriangle } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import { SECTIONS } from '../constants/sections';
import { formatDate, daysOld } from '../utils/dateHelpers';

const { Title, Text } = Typography;

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { products, loading } = useProducts();

    // Count by section
    const counts: Record<string, number> = {};
    for (const p of products) {
        counts[p.section] = (counts[p.section] || 0) + 1;
    }

    // Oldest 5 products
    const oldest = [...products]
        .filter((p) => p.dateOfProduction)
        .sort((a, b) => a.dateOfProduction.toMillis() - b.dateOfProduction.toMillis())
        .slice(0, 5);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Stats bar */}
            <div className="bg-gradient-to-br from-[#1677ff] to-[#0958d9] text-white rounded-[12px] px-5 py-4 mb-5">
                <div className="flex justify-between items-center">
                    <div>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                            إجمالي المنتجات
                        </Text>
                        <Title level={2} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                            {products.length}
                        </Title>
                    </div>
                    <div className="text-[40px] opacity-30">📦</div>
                </div>
            </div>

            {/* Section Cards */}
            <Title level={4} style={{ fontFamily: 'Cairo, sans-serif', marginBottom: 14 }}>
                الأقسام
            </Title>
            <Row gutter={[12, 12]} style={{ marginBottom: 28 }}>
                {SECTIONS.map((s) => {
                    const count = counts[s.key] || 0;
                    return (
                        <Col xs={12} sm={8} md={6} key={s.key}>
                            <div
                                className="bg-white rounded-[12px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-200 border-2 border-transparent hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:border-[#1677ff] hover:-translate-y-0.5 active:translate-y-0"
                                onClick={() => navigate(`/section/${s.key}`)}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        background: s.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 800,
                                        fontSize: 18,
                                        marginBottom: 10,
                                        fontFamily: 'Cairo, sans-serif',
                                    }}
                                >
                                    {s.key === 'THE_SIXTH' ? 'س' : s.key === 'EYES' ? 'ع' : s.key}
                                </div>
                                <Text
                                    style={{
                                        display: 'block',
                                        fontWeight: 700,
                                        fontFamily: 'Cairo, sans-serif',
                                        fontSize: 15,
                                        marginBottom: 2,
                                        color: 'var(--color-text)',
                                    }}
                                >
                                    {s.label}
                                </Text>
                                <Text style={{ color: s.color, fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}>
                                    {count} منتج
                                </Text>
                            </div>
                        </Col>
                    );
                })}
            </Row>

            {/* Oldest Products Widget */}
            {oldest.length > 0 && (
                <Card
                    style={{
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #fde68a',
                        background: '#fffbeb',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                    bodyStyle={{ padding: '16px 20px' }}
                >
                    <div className="flex items-center gap-2 mb-3.5">
                        <FiAlertTriangle style={{ color: '#f59e0b', fontSize: 20 }} />
                        <Text strong style={{ fontFamily: 'Cairo, sans-serif', fontSize: 15, color: '#92400e' }}>
                            أقدم المنتجات — يحتاج تصريف
                        </Text>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {oldest.map((p) => {
                            const days = daysOld(p.dateOfProduction);
                            const section = SECTIONS.find((s) => s.key === p.section);
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => navigate(`/product/${p.id}`)}
                                    className="flex justify-between items-center cursor-pointer px-3 py-2 bg-white rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                                >
                                    <div>
                                        <Text
                                            strong
                                            style={{ fontFamily: 'Cairo, sans-serif', display: 'block', fontSize: 14 }}
                                        >
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
                                        <span className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] rounded-lg px-2.5 py-1 text-xs text-[#92400e] font-semibold">{days} يوم</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {products.length === 0 && (
                <div className="text-center py-[60px] text-[#6b7c93]">
                    <div className="text-[60px] mb-3">📦</div>
                    <Text style={{ fontFamily: 'Cairo, sans-serif', fontSize: 16 }}>
                        لا توجد منتجات مضافة بعد
                    </Text>
                </div>
            )}
        </div>
    );
};

export default Home;
