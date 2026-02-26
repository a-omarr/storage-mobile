import React from 'react';
import { Descriptions, Tag, Button, Card, Space, Typography, Divider } from 'antd';
import { EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { SECTION_MAP } from '../../constants/sections';
import { formatDate, daysOld } from '../../utils/dateHelpers';

const { Title, Text } = Typography;

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const section = SECTION_MAP[product.section];
    const days = daysOld(product.dateOfProduction);
    const isOld = days > 365;

    return (
        <Card
            style={{
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: 'none',
                overflow: 'hidden',
            }}
            bodyStyle={{ padding: 0 }}
        >
            {/* Header */}
            <div
                style={{
                    background: section?.gradient || '#1677ff',
                    padding: '20px 24px',
                    color: 'white',
                }}
            >
                <Space style={{ marginBottom: 4 }}>
                    <Button
                        type="text"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate(-1)}
                        style={{ color: 'rgba(255,255,255,0.8)', padding: 0 }}
                    />
                    <Tag
                        style={{
                            background: 'rgba(255,255,255,0.25)',
                            border: 'none',
                            color: 'white',
                            fontWeight: 600,
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    >
                        {section?.label || product.section}
                    </Tag>
                </Space>
                <Title level={3} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                    {product.type} — {product.capacity}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Cairo, sans-serif' }}>
                    دفعة: {product.batchNumber}
                </Text>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
                {isOld && (
                    <div
                        style={{
                            background: '#fef3c7',
                            border: '1px solid #f59e0b',
                            borderRadius: 8,
                            padding: '10px 16px',
                            marginBottom: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <span style={{ fontSize: 20 }}>⚠️</span>
                        <Text style={{ color: '#92400e', fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}>
                            تحذير: هذا المنتج عمره {days} يوم — الأقدم
                        </Text>
                    </div>
                )}

                <Descriptions
                    column={2}
                    bordered
                    size="small"
                    labelStyle={{
                        background: '#f8fafc',
                        fontWeight: 600,
                        fontFamily: 'Cairo, sans-serif',
                        textAlign: 'right',
                    }}
                    contentStyle={{ fontFamily: 'Cairo, sans-serif' }}
                >
                    <Descriptions.Item label="رقم الصنف">{product.itemNo}</Descriptions.Item>
                    <Descriptions.Item label="رقم الدفعة">{product.batchNumber}</Descriptions.Item>
                    <Descriptions.Item label="اللون">{product.color}</Descriptions.Item>
                    <Descriptions.Item label="نوع الغطاء">{product.finishType}</Descriptions.Item>
                    <Descriptions.Item label="كمية لكل طبقة">{product.qtyPerLayer}</Descriptions.Item>
                    <Descriptions.Item label="عدد الطبقات">{product.numberOfLayers}</Descriptions.Item>
                    <Descriptions.Item label="قطع لكل بالت">{product.piecesPerPallet}</Descriptions.Item>
                    <Descriptions.Item label="عدد البالتات">
                        <Text strong style={{ fontSize: 16, color: '#1677ff' }}>
                            {product.numberOfPallet}
                        </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="تاريخ الإنتاج" span={2}>
                        <Text style={{ color: isOld ? '#ef4444' : 'inherit', fontWeight: isOld ? 600 : 400 }}>
                            {formatDate(product.dateOfProduction)}
                        </Text>
                        {isOld && (
                            <span className="oldest-badge" style={{ marginRight: 8 }}>
                                {days} يوم
                            </span>
                        )}
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/edit/${product.id}`)}
                        style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                        تعديل المنتج
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;
