import { Button, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd';
import { FiArrowDown, FiArrowUp, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../types/product';
import { SECTION_MAP } from '../../../constants/sections';
import { formatDate, daysOld } from '../../../utils/dateHelpers';

const { Text } = Typography;

interface ColumnsOptions {
    showSection: boolean;
    sortOrder: 'asc' | 'desc';
    toggleSort: () => void;
    handleDelete: (id: string) => void;
    navigate: ReturnType<typeof useNavigate>;
}

export const getProductColumns = ({
    showSection,
    sortOrder,
    toggleSort,
    handleDelete,
    navigate,
}: ColumnsOptions) => {
    const columns: any[] = [
        ...(showSection ? [{
            title: 'القسم',
            dataIndex: 'section',
            key: 'section',
            width: 80,
            render: (val: string) => {
                const s = SECTION_MAP[val as keyof typeof SECTION_MAP];
                return s ? (
                    <Tag color={s.color} style={{ fontWeight: 600 }}>{s.label}</Tag>
                ) : val;
            },
        }] : []),
        {
            title: 'النوع', dataIndex: 'type', key: 'type', width: 100,
            render: (v: string) => <Text strong>{v}</Text>
        },
        { title: 'السعة', dataIndex: 'capacity', key: 'capacity', width: 90 },
        { title: 'رقم الصنف', dataIndex: 'itemNo', key: 'itemNo', width: 90 },
        { title: 'رقم الدفعة', dataIndex: 'batchNumber', key: 'batchNumber', width: 110 },
        { title: 'اللون', dataIndex: 'color', key: 'color', width: 90 },
        { title: 'نوع الغطاء', dataIndex: 'finishType', key: 'finishType', width: 100 },
        { title: 'كمية/طبقة', dataIndex: 'qtyPerLayer', key: 'qtyPerLayer', width: 90 },
        { title: 'طبقات', dataIndex: 'numberOfLayers', key: 'numberOfLayers', width: 75 },
        { title: 'قطع/بالت', dataIndex: 'piecesPerPallet', key: 'piecesPerPallet', width: 90 },
        { title: 'عدد البالتات', dataIndex: 'numberOfPallet', key: 'numberOfPallet', width: 100 },
        {
            title: (
                <Space>
                    <span>تاريخ الإنتاج</span>
                    <Tooltip title={sortOrder === 'asc' ? 'الأقدم أولاً' : 'الأحدث أولاً'}>
                        <Button
                            type="text"
                            size="small"
                            icon={sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                            onClick={toggleSort}
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
                const isOld = days > 365;
                return (
                    <div>
                        <Text style={{ color: isOld ? '#ef4444' : 'inherit', fontWeight: isOld ? 600 : 400 }}>
                            {formatDate(ts)}
                        </Text>
                        {isOld && (
                            <div>
                                <span className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] rounded-lg px-2.5 py-1 text-xs text-[#92400e] font-semibold">
                                    {days} يوم
                                </span>
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
                            <Button type="text" icon={<FiTrash2 />} size="small" danger />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return columns;
};
