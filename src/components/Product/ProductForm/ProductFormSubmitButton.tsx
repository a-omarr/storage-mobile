import React from 'react';
import { Form, Button } from 'antd';
import { FiSave } from 'react-icons/fi';

interface Props {
    loading: boolean;
    isEdit: boolean;
}

const ProductFormSubmitButton: React.FC<Props> = ({ loading, isEdit }) => (
    <Form.Item style={{ marginTop: 24 }}>
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
);

export default ProductFormSubmitButton;
