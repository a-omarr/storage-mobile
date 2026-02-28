import React from 'react';
import { Form, DatePicker } from 'antd';

const labelStyle = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };

interface Props {
    inventory?: 1 | 2;
}

const ProductFormDate: React.FC<Props> = ({ inventory = 1 }) => (
    <Form.Item
        label={<span style={labelStyle}>تاريخ الإنتاج</span>}
        name="dateOfProduction"
        rules={[{ required: inventory === 1, message: 'يرجى إدخال تاريخ الإنتاج' }]}
    >
        <DatePicker
            size="large"
            format="DD/MM/YYYY"
            style={{ width: '100%', fontFamily: 'Cairo, sans-serif' }}
            placeholder="DD/MM/YYYY"
        />
    </Form.Item>
);

export default ProductFormDate;
