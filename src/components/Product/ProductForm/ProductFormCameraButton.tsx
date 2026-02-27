import React from 'react';
import { Button, Alert, Divider, Tag } from 'antd';
import { FiCamera } from 'react-icons/fi';
import type { OCRFeedback } from './useProductForm';

interface Props {
    ocrFeedback: OCRFeedback;
    onOpenCamera: () => void;
    onClearFeedback: () => void;
}

import ErrorBoundary from '../../Common/ErrorBoundary';

const ProductFormCameraButton: React.FC<Props> = ({ ocrFeedback, onOpenCamera, onClearFeedback }) => (
    <div className="mb-5">
        <ErrorBoundary
            fallback={
                <div className="text-center py-4 text-[#6b7c93] font-['Cairo',sans-serif] text-sm border-2 border-dashed border-gray-100 rounded-xl mb-4">
                    تعذّر تحميل ميزة الكاميرا — أدخل البيانات يدوياً
                </div>
            }
        >
            {ocrFeedback.status && (
                <Alert
                    message={ocrFeedback.message}
                    type={ocrFeedback.status}
                    showIcon
                    closable
                    onClose={onClearFeedback}
                    style={{ marginBottom: 16, fontFamily: 'Cairo, sans-serif', borderRadius: 12 }}
                    description={
                        ocrFeedback.missingFields.length > 0 && (
                            <div className="mt-2">
                                <div className="text-[12px] mb-1 opacity-70">يُرجى إكمال الحقول التالية يدوياً:</div>
                                <div className="flex flex-wrap gap-1">
                                    {ocrFeedback.missingFields.map(field => (
                                        <Tag key={field} color="default" style={{ borderRadius: 4, fontSize: 11 }}>
                                            {field}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )
                    }
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
        </ErrorBoundary>
        <Divider style={{ margin: '16px 0 20px' }}>أو أدخل البيانات يدوياً</Divider>
    </div>
);

export default ProductFormCameraButton;
