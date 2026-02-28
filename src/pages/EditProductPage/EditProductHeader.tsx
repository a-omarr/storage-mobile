import { Typography, App } from 'antd';
import { FiEdit2, FiX } from 'react-icons/fi';

const { Title } = Typography;

interface Props {
    gradient: string;
    productName: string;
    onCancel: () => void;
}

const EditProductHeader: React.FC<Props> = ({ gradient, productName, onCancel }) => {
    const { modal } = App.useApp();

    const handleCancelClick = () => {
        modal.confirm({
            title: 'إلغاء التعديل',
            content: 'هل أنت متأكد من إلغاء تعديل المنتج؟ لن يتم حفظ أي تغييرات.',
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
                <FiEdit2 className="inline ml-2" />
                تعديل منتج — {productName}
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

export default EditProductHeader;
