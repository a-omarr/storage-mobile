import { Typography, App } from 'antd';
import { FiPlusCircle, FiX } from 'react-icons/fi';

const { Title } = Typography;

interface Props {
    gradient: string;
    sectionLabel?: string;
    onCancel: () => void;
}

const AddProductHeader: React.FC<Props> = ({ gradient, sectionLabel, onCancel }) => {
    const { modal } = App.useApp();

    const handleCancelClick = () => {
        modal.confirm({
            title: 'إلغاء الإضافة',
            content: 'هل أنت متأكد من إلغاء إضافة المنتج؟ لن يتم حفظ أي بيانات.',
            okText: 'نعم، إلغاء',
            cancelText: 'لا، تراجع',
            okType: 'danger',
            onOk: onCancel,
            centered: true,
            style: { fontFamily: 'Cairo, sans-serif' },
            okButtonProps: { style: { fontFamily: 'Cairo, sans-serif' }, danger: true },
            cancelButtonProps: { style: { fontFamily: 'Cairo, sans-serif' } },
        });
    };

    return (
        <div
            className="rounded-[12px] px-6 py-4 mb-5 flex items-center justify-between"
            style={{ background: gradient }}
        >
            <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                <FiPlusCircle className="inline ml-2" />
                إضافة منتج جديد{sectionLabel ? ` — ${sectionLabel}` : ''}
            </Title>

            <button
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center text-white cursor-pointer border-0 shrink-0"
                title="إلغاء"
                onClick={handleCancelClick}
            >
                <FiX size={18} />
            </button>
        </div>
    );
};

export default AddProductHeader;
