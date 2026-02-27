import React from 'react';
import { Descriptions, Typography } from 'antd';
import type { Product } from '../../../types/product';
import { formatDate, daysOld } from '../../../utils/dateHelpers';

const { Text } = Typography;

interface Props {
    product: Product;
}

const ProductCardBody: React.FC<Props> = ({ product }) => {
    const days = daysOld(product.dateOfProduction);
    const isOld = days > 365;

    return (
        <Descriptions
            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
            bordered
            size="small"
            labelStyle={{
                background: '#f8fafc',
                fontWeight: 600,
                fontFamily: 'Cairo, sans-serif',
                textAlign: 'right',
            }}
            contentStyle={{ fontFamily: 'Cairo, sans-serif' }}
        >
            <Descriptions.Item label="رقم الصنف">{product.itemNo}</Descriptions.Item>
            <Descriptions.Item label="رقم الدفعة">{product.batchNumber}</Descriptions.Item>
            <Descriptions.Item label="اللون">{product.color}</Descriptions.Item>
            <Descriptions.Item label="نوع الغطاء">{product.finishType}</Descriptions.Item>
            <Descriptions.Item label="كمية لكل طبقة">{product.qtyPerLayer}</Descriptions.Item>
            <Descriptions.Item label="عدد الطبقات">{product.numberOfLayers}</Descriptions.Item>
            <Descriptions.Item label="قيمة التعبئة \ السعة">{product.piecesPerPallet}</Descriptions.Item>
            <Descriptions.Item label="رقم الطلبية">{product.numberOfPallet}</Descriptions.Item>
            <Descriptions.Item label="تاريخ الإنتاج" span={2}>
                <Text style={{ color: isOld ? '#ef4444' : 'inherit', fontWeight: isOld ? 600 : 400 }}>
                    {formatDate(product.dateOfProduction)}
                </Text>
                {isOld && (
                    <span className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#f59e0b] rounded-lg px-2.5 py-1 text-xs text-[#92400e] font-semibold mr-2">
                        {days} يوم
                    </span>
                )}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default ProductCardBody;
