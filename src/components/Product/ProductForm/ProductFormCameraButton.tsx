import React from 'react';
import { Button, Alert, Divider } from 'antd';
import { FiCamera } from 'react-icons/fi';

interface Props {
    ocrSuccess: boolean;
    onOpenCamera: () => void;
}

const ProductFormCameraButton: React.FC<Props> = ({ ocrSuccess, onOpenCamera }) => (
    <div className="mb-5">
        {ocrSuccess && (
            <Alert
                message="تم قراءة البيانات من الصورة بنجاح ✓"
                type="success"
                showIcon
                closable
                style={{ marginBottom: 12, fontFamily: 'Cairo, sans-serif' }}
            />
        )}
        <Button
            size="large"
            icon={<FiCamera />}
            onClick={onOpenCamera}
            style={{
                width: '100%',
                height: 52,
                borderRadius: 12,
                borderStyle: 'dashed',
                borderColor: '#1677ff',
                color: '#1677ff',
                fontFamily: 'Cairo, sans-serif',
                fontSize: 16,
                fontWeight: 600,
            }}
        >
            قراءة الإيصال بالكاميرا
        </Button>
        <Divider style={{ margin: '16px 0 20px' }}>أو أدخل البيانات يدوياً</Divider>
    </div>
);

export default ProductFormCameraButton;
