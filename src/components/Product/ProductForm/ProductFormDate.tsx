import React from 'react';
import { Form, DatePicker, Button } from 'antd';
import { FiSave } from 'react-icons/fi';

const labelStyle = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };

interface Props {
    loading: boolean;
    isEdit: boolean;
}

const ProductFormDate: React.FC<Props> = ({ loading, isEdit }) => (
    <>
        <Form.Item
            label={<span style={labelStyle}>تاريخ الإنتاج</span>}
            name="dateOfProduction"
            rules={[{ required: true, message: 'يرجى إدخال تاريخ الإنتاج' }]}
        >
            <DatePicker
                size="large"
                format="DD/MM/YYYY"
                style={{ width: '100%', fontFamily: 'Cairo, sans-serif' }}
                placeholder="DD/MM/YYYY"
            />
        </Form.Item>

        <Form.Item style={{ marginTop: 8 }}>
            <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<FiSave />}
                style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 12,
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: 16,
                    fontWeight: 700,
                }}
            >
                {isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </Button>
        </Form.Item>
    </>
);

export default ProductFormDate;
