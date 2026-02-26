import React, { useState } from 'react';
import { Table, Button, Popconfirm, Tag, Tooltip, Space, Typography } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import type { Product } from '../../types/product';
import { SECTION_MAP } from '../../constants/sections';
import { formatDate, daysOld } from '../../utils/dateHelpers';

const { Text } = Typography;

interface ProductTableProps {
    products: Product[];
    loading?: boolean;
    showSection?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    loading = false,
    showSection = false,
}) => {
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const sorted = [...products].sort((a, b) => {
        const ta = a.dateOfProduction?.toMillis() ?? 0;
        const tb = b.dateOfProduction?.toMillis() ?? 0;
        return sortOrder === 'asc' ? ta - tb : tb - ta;
    });

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const columns: any[] = [
        ...(showSection
            ? [
                {
                    title: 'القسم',
                    dataIndex: 'section',
                    key: 'section',
                    width: 80,
                    render: (val: string) => {
                        const s = SECTION_MAP[val as keyof typeof SECTION_MAP];
                        return s ? (
                            <Tag color={s.color} style={{ fontWeight: 600 }}>
                                {s.label}
                            </Tag>
                        ) : val;
                    },
                },
            ]
            : []),
        {
            title: 'النوع',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (v: string) => <Text strong>{v}</Text>,
        },
        {
            title: 'السعة',
            dataIndex: 'capacity',
            key: 'capacity',
            width: 90,
        },
        {
            title: 'رقم الصنف',
            dataIndex: 'itemNo',
            key: 'itemNo',
            width: 90,
        },
        {
            title: 'رقم الدفعة',
            dataIndex: 'batchNumber',
            key: 'batchNumber',
            width: 110,
        },
        {
            title: 'اللون',
            dataIndex: 'color',
            key: 'color',
            width: 90,
        },
        {
            title: 'نوع الغطاء',
            dataIndex: 'finishType',
            key: 'finishType',
            width: 100,
        },
        {
            title: 'كمية/طبقة',
            dataIndex: 'qtyPerLayer',
            key: 'qtyPerLayer',
            width: 90,
        },
        {
            title: 'طبقات',
            dataIndex: 'numberOfLayers',
            key: 'numberOfLayers',
            width: 75,
        },
        {
            title: 'قطع/بالت',
            dataIndex: 'piecesPerPallet',
            key: 'piecesPerPallet',
            width: 90,
        },
        {
            title: 'عدد البالتات',
            dataIndex: 'numberOfPallet',
            key: 'numberOfPallet',
            width: 100,
        },
        {
            title: (
                <Space>
                    <span>تاريخ الإنتاج</span>
                    <Tooltip title={sortOrder === 'asc' ? 'الأقدم أولاً' : 'الأحدث أولاً'}>
                        <Button
                            type="text"
                            size="small"
                            icon={
                                sortOrder === 'asc' ? (
                                    <SortAscendingOutlined />
                                ) : (
                                    <SortDescendingOutlined />
                                )
                            }
                            onClick={() => setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'))}
                            style={{ padding: 4 }}
                        />
                    </Tooltip>
                </Space>
            ),
            dataIndex: 'dateOfProduction',
            key: 'dateOfProduction',
            width: 130,
            render: (ts: any) => {
                const days = daysOld(ts);
                const dateStr = formatDate(ts);
                const isOld = days > 365;
                return (
                    <div>
                        <Text style={{ color: isOld ? '#ef4444' : 'inherit', fontWeight: isOld ? 600 : 400 }}>
                            {dateStr}
                        </Text>
                        {isOld && (
                            <div>
                                <span className="oldest-badge">{days} يوم</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'إجراءات',
            key: 'actions',
            width: 90,
            fixed: 'right' as const,
            render: (_: any, record: Product) => (
                <Space>
                    <Tooltip title="تعديل">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => navigate(`/edit/${record.id}`)}
                            style={{ color: '#1677ff' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="هل أنت متأكد من الحذف؟"
                        onConfirm={() => handleDelete(record.id)}
                        okText="حذف"
                        cancelText="إلغاء"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="حذف">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="product-table-container">
            <Table
                dataSource={sorted}
                columns={columns}
                rowKey="id"
                loading={loading}
                scroll={{ x: 1100 }}
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total) => `إجمالي ${total} منتج`,
                    position: ['bottomCenter'],
                }}
                onRow={(record) => ({
                    style: { cursor: 'pointer' },
                    onClick: (e) => {
                        // Don't navigate if clicking action buttons
                        const target = e.target as HTMLElement;
                        if (target.closest('.ant-btn') || target.closest('.ant-popover')) return;
                        navigate(`/product/${record.id}`);
                    },
                })}
                locale={{
                    emptyText: (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
                            <div>لا توجد منتجات في هذا القسم</div>
                        </div>
                    ),
                }}
                size="middle"
            />
        </div>
    );
};

export default ProductTable;
