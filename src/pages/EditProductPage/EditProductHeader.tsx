import React from 'react';
import { Typography, Popconfirm } from 'antd';
import { FiEdit2, FiX } from 'react-icons/fi';

const { Title } = Typography;

interface Props {
    gradient: string;
    productName: string;
    onCancel: () => void;
}

const EditProductHeader: React.FC<Props> = ({ gradient, productName, onCancel }) => (
    <div
        className="rounded-[12px] px-6 py-4 mb-5 flex items-center justify-between"
        style={{ background: gradient }}
    >
        <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
            <FiEdit2 className="inline ml-2" />
            تعديل منتج — {productName}
        </Title>
        <Popconfirm
            title="إلغاء التعديل"
            description="هل أنت متأكد من إلغاء تعديل المنتج؟ لن يتم حفظ أي تغييرات."
            onConfirm={onCancel}
            okText="نعم، إلغاء"
            cancelText="لا، تراجع"
            okButtonProps={{ danger: true }}
            placement="bottomLeft"
        >
            <button
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center text-white cursor-pointer border-0 shrink-0"
                title="إلغاء"
            >
                <FiX size={18} />
            </button>
        </Popconfirm>
    </div>
);

export default EditProductHeader;
