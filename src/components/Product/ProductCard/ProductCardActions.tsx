import React from 'react';
import { Button, App } from 'antd';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProductDelete } from '../ProductTable/useProductDelete';

interface Props {
    productId: string;
}

const ProductCardActions: React.FC<Props> = ({ productId }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleDelete } = useProductDelete();
    const { modal } = App.useApp();

    // Get the current section to handle partial deletion if needed
    const searchParams = new URLSearchParams(location.search);
    const urlSection = searchParams.get('section');

    const onDelete = async () => {
        const compoundId = urlSection ? `${productId}::${urlSection}` : productId;
        const success = await handleDelete(compoundId);
        if (success) {
            navigate(urlSection ? `/section/${urlSection}` : '/');
        }
    };

    const showConfirm = () => {
        modal.confirm({
            title: 'هل أنت متأكد من حذف هذا المنتج؟',
            content: 'لن تتمكن من التراجع عن هذا الإجراء.',
            okText: 'حذف',
            okType: 'danger',
            cancelText: 'إلغاء',
            onOk: onDelete,
            centered: true,
            style: { fontFamily: 'Cairo, sans-serif' },
            okButtonProps: { style: { fontFamily: 'Cairo, sans-serif' } },
            cancelButtonProps: { style: { fontFamily: 'Cairo, sans-serif' } },
        });
    };

    return (
        <div className="flex justify-end gap-3 items-center">
            <Button
                danger
                icon={<FiTrash2 />}
                onClick={showConfirm}
                style={{ fontFamily: 'Cairo, sans-serif' }}
            >
                حذف المنتج
            </Button>

            <Button
                type="primary"
                icon={<FiEdit />}
                onClick={() => navigate(`/edit/${productId}`)}
                style={{ fontFamily: 'Cairo, sans-serif' }}
            >
                تعديل المنتج
            </Button>
        </div>
    );
};

export default ProductCardActions;
