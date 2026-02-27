import { Button, Modal, Space, Tag, Typography } from 'antd';
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
}

const ProductMobileCard: React.FC<Props> = ({ record, showSection }) => {
    const navigate = useNavigate();
    const { handleDelete } = useProductDelete();
    const days = daysOld(record.dateOfProduction);
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
                className="bg-white rounded-[12px] p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#e2e8f0] cursor-pointer"
                onClick={() => navigate(`/product/${record.id}`)}
            >
                {/* Card Header */}
                <div className="flex justify-between mb-2.5 border-b border-[#e2e8f0] pb-2 items-center">
                    <div>
                        {showSection && (() => {
                            const s = SECTION_MAP[record.section as keyof typeof SECTION_MAP];
                            return s ? (
                                <div className="mb-1">
                                    <Tag color={s.color} style={{ fontSize: 10, lineHeight: '16px', fontWeight: 600 }}>
                                        {s.label}
                                    </Tag>
                                </div>
                            ) : null;
                        })()}
                        <Text strong style={{ fontSize: 15 }}>
                            {record.type} — {record.capacity}
                        </Text>
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

                {/* Card Rows */}
                {[
                    { label: 'رقم الصنف:', value: record.itemNo },
                    { label: 'الدفعة:', value: record.batchNumber },
                ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between mb-1.5 text-[13px]">
                        <span className="text-[#6b7c93] font-['Cairo',sans-serif]">{label}</span>
                        <span className="font-semibold text-[#1a2332]">{value}</span>
                    </div>
                ))}

                <div className="flex justify-between mb-1.5 text-[13px]">
                    <span className="text-[#6b7c93] font-['Cairo',sans-serif]">رقم الطلبية:</span>
                    <Text className="font-semibold text-[#1a2332]">{record.numberOfPallet}</Text>
                </div>

                <div className="flex justify-between mb-1.5 text-[13px]">
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
        </ProductMobileCardSwipe>
    );
};

export default ProductMobileCard;
