import React from 'react';
import { Form, Input } from 'antd';

const labelStyle = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };

const ProductFormDetails: React.FC = () => (
    <div className="flex flex-col sm:flex-row gap-3">
        <Form.Item
            label={<span style={labelStyle}>اللون</span>}
            name="color"
            rules={[{ required: true, message: 'مطلوب' }]}
            className="flex-1 min-w-0 mb-0 sm:mb-6"
        >
            <Input size="large" placeholder="مثال: Flint" />
        </Form.Item>
        <Form.Item
            label={<span style={labelStyle}>نوع الغطاء</span>}
            name="finishType"
            rules={[{ required: true, message: 'مطلوب' }]}
            className="flex-1 min-w-0 mb-0 sm:mb-6"
        >
            <Input size="large" placeholder="مثال: CORK" />
        </Form.Item>
    </div>
);

export default ProductFormDetails;
