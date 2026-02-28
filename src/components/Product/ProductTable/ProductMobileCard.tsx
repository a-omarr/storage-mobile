import React from 'react';
import { Button, Tag, Typography, Checkbox, Modal, Space } from 'antd';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../types/product';
import { SECTION_MAP } from '../../../constants/sections';
import { formatDate, daysOld } from '../../../utils/dateHelpers';
import { useProductDelete } from './useProductDelete';
import ProductMobileCardSwipe from './ProductMobileCardSwipe';

const { Text } = Typography;

interface Props {
    record: Product;
    showSection: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

const ProductMobileCard: React.FC<Props> = ({ record, showSection, isSelected = false, onToggleSelect }) => {
    const navigate = useNavigate();
    const { handleDelete } = useProductDelete();

    const days = record.dateOfProduction ? daysOld(record.dateOfProduction) : 0;
    const isOld = days > 365;

    const onSwipeDelete = () => {
        Modal.confirm({
            title: 'هل أنت متأكد من حذف هذا المنتج؟',
            content: `${record.type} — ${record.capacity}`,
            okText: 'حذف',
            okType: 'danger',
            cancelText: 'إلغاء',
            onOk: () => handleDelete(record.id),
            style: { fontFamily: 'Cairo, sans-serif' }
        });
    };

    return (
        <ProductMobileCardSwipe onDelete={onSwipeDelete}>
            <div
                className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50 hover:bg-blue-50/60' : 'bg-white'}`}
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('.ant-btn') || target.closest('.ant-popconfirm') || target.closest('.ant-checkbox-wrapper')) return;
                    const queryParam = (record as any).displaySection ? `?section=${(record as any).displaySection}` : '';
                    navigate(`/product/${record.id}${queryParam}`);
                }}
            >
                <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {onToggleSelect && (
                            <div className="pt-1">
                                <Checkbox
                                    checked={isSelected}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        onToggleSelect();
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            {showSection && record.sections && Array.isArray(record.sections) && (
                                <div className="mb-1 flex flex-wrap gap-1">
                                    {(record as any).displaySection ? (
                                        (() => {
                                            const secKey = (record as any).displaySection;
                                            const s = SECTION_MAP[secKey as keyof typeof SECTION_MAP];
                                            return s ? (
                                                <Tag color={s.color} style={{ fontSize: 10, lineHeight: '16px', fontWeight: 600, margin: 0 }}>
                                                    {s.label}
                                                </Tag>
                                            ) : null;
                                        })()
                                    ) : (
                                        record.sections.map(val => {
                                            const s = SECTION_MAP[val as keyof typeof SECTION_MAP];
                                            return s ? (
                                                <Tag key={val} color={s.color} style={{ fontSize: 10, lineHeight: '16px', fontWeight: 600, margin: 0 }}>
                                                    {s.label}
                                                </Tag>
                                            ) : null;
                                        })
                                    )}
                                </div>
                            )}
                            <Text strong style={{ fontSize: 15 }}>
                                {record.type} — {record.capacity}
                            </Text>
                        </div>
                    </div>
                    <Space>
                        <Button
                            type="text"
                            icon={<FiEdit />}
                            size="small"
                            onClick={(e) => { e.stopPropagation(); navigate(`/edit/${record.id}`); }}
                            style={{ color: '#1677ff' }}
                        />
                        <Button
                            type="text"
                            icon={<FiTrash2 />}
                            size="small"
                            danger
                            onClick={(e) => { e.stopPropagation(); onSwipeDelete(); }}
                        />
                    </Space>
                </div>

                <div className="flex flex-col gap-1">
                    {[
                        { label: 'رقم الصنف:', value: record.itemNo },
                        { label: 'الدفعة:', value: record.batchNumber },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-[13px]">
                            <span className="text-[#6b7c93] font-['Cairo',sans-serif]">{label}</span>
                            <span className="font-semibold text-[#1a2332]">{value}</span>
                        </div>
                    ))}

                    <div className="flex justify-between text-[13px]">
                        <span className="text-[#6b7c93] font-['Cairo',sans-serif]">رقم الطلبية:</span>
                        <Text className="font-semibold text-[#1a2332]">{record.numberOfPallet}</Text>
                    </div>

                    <div className="flex justify-between text-[13px]">
                        <span className="text-[#6b7c93] font-['Cairo',sans-serif]">تاريخ الإنتاج:</span>
                        <span>
                            <Text style={{ color: isOld ? '#ef4444' : 'inherit', fontWeight: isOld ? 600 : 400, fontSize: 13 }}>
                                {formatDate(record.dateOfProduction)}
                            </Text>
                            {isOld && (
                                <span className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] rounded-lg px-1.5 py-0.5 text-[10px] text-[#92400e] font-semibold ml-1">
                                    {days} يوم
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </ProductMobileCardSwipe>
    );
};

export default ProductMobileCard;
