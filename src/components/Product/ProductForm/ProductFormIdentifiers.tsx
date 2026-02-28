import React from 'react';
import { Form, Input } from 'antd';

const labelStyle = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };

interface Props {
    inventory?: 1 | 2;
}

const ProductFormIdentifiers: React.FC<Props> = ({ inventory = 1 }) => (
    <>
        <div className="flex flex-col sm:flex-row gap-3">
            <Form.Item
                label={<span style={labelStyle}>رقم الصنف</span>}
                name="itemNo"
                rules={[{ required: inventory === 1, message: 'مطلوب' }]}
                className="flex-1 min-w-0 mb-0 sm:mb-6"
            >
                <Input size="large" placeholder="مثال: 264" />
            </Form.Item>
            <Form.Item
                label={<span style={labelStyle}>رقم الدفعة</span>}
                name="batchNumber"
                rules={[{ required: inventory === 1, message: 'مطلوب' }]}
                className="flex-1 min-w-0 mb-0 sm:mb-6"
            >
                <Input size="large" placeholder="مثال: 264-006" />
            </Form.Item>
        </div>

        {inventory === 2 && (
            <Form.Item
                label={<span style={labelStyle}>السعة</span>}
                name="capacity"
                rules={[{ required: false }]}
                className="mb-6"
            >
                <Input size="large" placeholder="مثال: 750 ML" />
            </Form.Item>
        )}
    </>
);

export default ProductFormIdentifiers;
