import React, { useState } from 'react';
import { Table, Button, Popconfirm, Tag, Tooltip, Space, Typography } from 'antd';
import { FiEdit, FiTrash2, FiArrowUp, FiArrowDown, FiPackage } from 'react-icons/fi';
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
                                    <FiArrowUp />
                                ) : (
                                    <FiArrowDown />
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
                                <span className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] rounded-lg px-2.5 py-1 text-xs text-[#92400e] font-semibold">{days} يوم</span>
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
                            icon={<FiEdit />}
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
                                icon={<FiTrash2 />}
                                size="small"
                                danger
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const renderMobileCards = () => (
        <div className="md:hidden">
            {sorted.map((record) => (
                <div
                    key={record.id}
                    className="bg-white rounded-[12px] p-3.5 mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#e2e8f0] cursor-pointer"
                    onClick={() => navigate(`/product/${record.id}`)}
                >
                    <div className="flex justify-between mb-2.5 border-b border-[#e2e8f0] pb-2 items-center">
                        <div>
                            {showSection && (
                                <div className="mb-1">
                                    {(() => {
                                        const s = SECTION_MAP[record.section as keyof typeof SECTION_MAP];
                                        return s ? (
                                            <Tag color={s.color} style={{ fontSize: 10, lineHeight: '16px', fontWeight: 600 }}>
                                                {s.label}
                                            </Tag>
                                        ) : null;
                                    })()}
                                </div>
                            )}
                            <Text strong style={{ fontSize: 15 }}>{record.type} — {record.capacity}</Text>
                        </div>
                        <Space>
                            <Button
                                type="text"
                                icon={<FiEdit />}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/edit/${record.id}`);
                                }}
                                style={{ color: '#1677ff' }}
                            />
                            <Popconfirm
                                title="هل أنت متأكد من الحذف؟"
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    handleDelete(record.id);
                                }}
                                onCancel={(e) => e?.stopPropagation()}
                                okText="حذف"
                                cancelText="إلغاء"
                                okButtonProps={{ danger: true }}
                            >
                                <Button
                                    type="text"
                                    icon={<FiTrash2 />}
                                    size="small"
                                    danger
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </Popconfirm>
                        </Space>
                    </div>

                    <div className="flex justify-between mb-1.5 text-[13px]">
                        <span className="text-[#6b7c93] font-['Cairo',sans-serif]">رقم الصنف:</span>
                        <span className="font-semibold text-[#1a2332]">{record.itemNo}</span>
                    </div>
                    <div className="flex justify-between mb-1.5 text-[13px]">
                        <span className="text-[#6b7c93] font-['Cairo',sans-serif]">الدفعة:</span>
                        <span className="font-semibold text-[#1a2332]">{record.batchNumber}</span>
                    </div>
                    <div className="flex justify-between mb-1.5 text-[13px]">
                        <span className="text-[#6b7c93] font-['Cairo',sans-serif]">بالتات:</span>
                        <Text strong style={{ color: '#1677ff' }}>{record.numberOfPallet}</Text>
                    </div>
                    <div className="flex justify-between mb-1.5 text-[13px]">
                        <span className="text-[#6b7c93] font-['Cairo',sans-serif]">تاريخ الإنتاج:</span>
                        <span>
                            {formatDate(record.dateOfProduction)}
                            {daysOld(record.dateOfProduction) > 365 && (
                                <span className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] rounded-lg px-1.5 py-0.5 text-[10px] text-[#92400e] font-semibold ml-1">
                                    {daysOld(record.dateOfProduction)} يوم
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="hidden md:block">
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
                            const target = e.target as HTMLElement;
                            if (target.closest('.ant-btn') || target.closest('.ant-popover')) return;
                            navigate(`/product/${record.id}`);
                        },
                    })}
                    locale={{
                        emptyText: (
                            <div className="py-10 text-center text-[#6b7c93]">
                                <FiPackage className="text-[40px] mb-2 mx-auto" />
                                <div>لا توجد منتجات في هذا القسم</div>
                            </div>
                        ),
                    }}
                    size="middle"
                />
            </div>
            {renderMobileCards()}
            {products.length === 0 && !loading && (
                <div className="md:hidden py-10 text-center text-[#6b7c93]">
                    <FiPackage className="text-[40px] mb-2 mx-auto" />
                    <div>لا توجد منتجات</div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
