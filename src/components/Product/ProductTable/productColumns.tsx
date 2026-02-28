import { Button, Space, Tag, Tooltip, Typography } from 'antd';
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
    modal: any;
}

export const getProductColumns = ({
    showSection,
    sortOrder,
    toggleSort,
    handleDelete,
    navigate,
    modal,
}: ColumnsOptions) => {
    const columns: any[] = [
        ...(showSection ? [{
            title: 'الأقسام',
            dataIndex: 'sections',
            key: 'sections',
            width: 120,
            render: (sections: string[], record: any) => {
                if (record.displaySection) {
                    const s = SECTION_MAP[record.displaySection as keyof typeof SECTION_MAP];
                    return s ? <Tag color={s.color} style={{ fontWeight: 600, margin: 0 }}>{s.label}</Tag> : null;
                }

                if (!sections || !Array.isArray(sections)) return null;
                return (
                    <Space size={[0, 4]} wrap>
                        {sections.map(val => {
                            const s = SECTION_MAP[val as keyof typeof SECTION_MAP];
                            return s ? (
                                <Tag key={val} color={s.color} style={{ fontWeight: 600 }}>{s.label}</Tag>
                            ) : null;
                        })}
                    </Space>
                );
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
        { title: 'رقم الطلبية', dataIndex: 'numberOfPallet', key: 'numberOfPallet', width: 100 },
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
                    <Tooltip title="حذف">
                        <Button
                            type="text"
                            icon={<FiTrash2 />}
                            size="small"
                            danger
                            onClick={() => {
                                modal.confirm({
                                    title: 'هل أنت متأكد من الحذف؟',
                                    content: `${record.type} — ${record.capacity}`,
                                    okText: 'حذف',
                                    okType: 'danger',
                                    cancelText: 'إلغاء',
                                    onOk: () => {
                                        const compoundId = (record as any).displaySection
                                            ? `${record.id}::${(record as any).displaySection}`
                                            : record.id;
                                        handleDelete(compoundId);
                                    },
                                    centered: true,
                                    style: { fontFamily: 'Cairo, sans-serif' },
                                    okButtonProps: { style: { fontFamily: 'Cairo, sans-serif' }, danger: true },
                                    cancelButtonProps: { style: { fontFamily: 'Cairo, sans-serif' } },
                                });
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return columns;
};
