import React from 'react';
import { Form, InputNumber } from 'antd';

const labelStyle = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };

const ProductFormPallet: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
            { label: 'كمية لكل طبقة', name: 'qtyPerLayer', placeholder: 'مثال: 12' },
            { label: 'عدد الطبقات', name: 'numberOfLayers', placeholder: 'مثال: 5' },
            { label: 'قطع لكل بالت', name: 'piecesPerPallet', placeholder: 'مثال: 60' },
            { label: 'عدد البالتات', name: 'numberOfPallet', placeholder: 'مثال: 1' },
        ].map(({ label, name, placeholder }) => (
            <Form.Item
                key={name}
                label={<span style={labelStyle}>{label}</span>}
                name={name}
                rules={[{ required: true, message: 'مطلوب' }]}
            >
                <InputNumber
                    size="large"
                    min={0}
                    style={{ width: '100%' }}
                    placeholder={placeholder}
                />
            </Form.Item>
        ))}
    </div>
);

export default ProductFormPallet;
