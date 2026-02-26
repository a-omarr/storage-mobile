import React from 'react';
import { Typography } from 'antd';
import { FiEdit2 } from 'react-icons/fi';

const { Title } = Typography;

interface Props {
    gradient: string;
    productName: string;
}

const EditProductHeader: React.FC<Props> = ({ gradient, productName }) => (
    <div
        className="rounded-[12px] px-6 py-4 mb-5"
        style={{ background: gradient }}
    >
        <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
            <FiEdit2 className="inline ml-2" />
            تعديل منتج — {productName}
        </Title>
    </div>
);

export default EditProductHeader;
