import React from 'react';
import { Typography } from 'antd';
import { FiAlertOctagon } from 'react-icons/fi';

const { Text } = Typography;

interface Props {
    days: number;
}

const ProductCardWarning: React.FC<Props> = ({ days }) => (
    <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2">
        <FiAlertOctagon className="text-xl shrink-0" />
        <Text style={{ color: '#92400e', fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}>
            تحذير: هذا المنتج عمره {days} يوم — الأقدم
        </Text>
    </div>
);

export default ProductCardWarning;
