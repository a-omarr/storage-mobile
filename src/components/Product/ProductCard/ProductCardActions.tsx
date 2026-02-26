import React from 'react';
import { Button } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface Props {
    productId: string;
}

const ProductCardActions: React.FC<Props> = ({ productId }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-end">
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
