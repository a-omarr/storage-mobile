import React from 'react';
import { Button, Popconfirm } from 'antd';
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

    return (
        <div className="flex justify-end gap-3 items-center">
            <Popconfirm
                title="هل أنت متأكد من حذف هذا المنتج؟"
                onConfirm={onDelete}
                okText="حذف"
                cancelText="إلغاء"
                okButtonProps={{ danger: true }}
            >
                <Button
                    danger
                    icon={<FiTrash2 />}
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                    حذف المنتج
                </Button>
            </Popconfirm>

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
