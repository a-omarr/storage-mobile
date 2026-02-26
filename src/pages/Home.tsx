import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Spin, Card } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
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
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Stats bar */}
            <div className="stats-bar" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                            إجمالي المنتجات
                        </Text>
                        <Title level={2} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                            {products.length}
                        </Title>
                    </div>
                    <div style={{ fontSize: 40, opacity: 0.3 }}>📦</div>
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
                                className="section-card"
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <WarningOutlined style={{ color: '#f59e0b', fontSize: 20 }} />
                        <Text strong style={{ fontFamily: 'Cairo, sans-serif', fontSize: 15, color: '#92400e' }}>
                            أقدم المنتجات — يحتاج تصريف
                        </Text>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {oldest.map((p) => {
                            const days = daysOld(p.dateOfProduction);
                            const section = SECTIONS.find((s) => s.key === p.section);
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => navigate(`/product/${p.id}`)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        padding: '8px 12px',
                                        background: 'white',
                                        borderRadius: 10,
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    }}
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
                                    <div style={{ textAlign: 'left' }}>
                                        <Text style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'Cairo, sans-serif', display: 'block' }}>
                                            {formatDate(p.dateOfProduction)}
                                        </Text>
                                        <span className="oldest-badge">{days} يوم</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {products.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: 60, marginBottom: 12 }}>📦</div>
                    <Text style={{ fontFamily: 'Cairo, sans-serif', fontSize: 16 }}>
                        لا توجد منتجات مضافة بعد
                    </Text>
                </div>
            )}
        </div>
    );
};

export default Home;
