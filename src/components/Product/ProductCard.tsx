import React from 'react';
import { Descriptions, Tag, Button, Card, Space, Typography, Divider } from 'antd';
import { FiEdit, FiArrowRight } from 'react-icons/fi';
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
                className="px-6 py-5 text-white"
                style={{ background: section?.gradient || '#1677ff' }}
            >
                <Space style={{ marginBottom: 4 }}>
                    <Button
                        type="text"
                        icon={<FiArrowRight />}
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
            <div className="p-6">
                {isOld && (
                    <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
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
                            <span className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] rounded-lg px-2.5 py-1 text-xs text-[#92400e] font-semibold mr-2">
                                {days} يوم
                            </span>
                        )}
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div className="flex justify-end">
                    <Button
                        type="primary"
                        icon={<FiEdit />}
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
