import React from 'react';
import { Form, Input } from 'antd';

const labelStyle = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };

const ProductFormIdentifiers: React.FC = () => (
    <div className="flex flex-col sm:flex-row gap-3">
        <Form.Item
            label={<span style={labelStyle}>رقم الصنف</span>}
            name="itemNo"
            rules={[{ required: true, message: 'مطلوب' }]}
            className="flex-1 min-w-0 mb-0 sm:mb-6"
        >
            <Input size="large" placeholder="مثال: 264" />
        </Form.Item>
        <Form.Item
            label={<span style={labelStyle}>رقم الدفعة</span>}
            name="batchNumber"
            rules={[{ required: true, message: 'مطلوب' }]}
            className="flex-1 min-w-0 mb-0 sm:mb-6"
        >
            <Input size="large" placeholder="مثال: 264-006" />
        </Form.Item>
    </div>
);

export default ProductFormIdentifiers;
