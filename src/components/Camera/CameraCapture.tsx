import React, { useRef, useState } from 'react';
import { Button, Space, Typography } from 'antd';
import { CameraOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import OCRProcessor from './OCRProcessor.tsx';
import type { ParsedOCRData } from '../../utils/ocrParser.ts';

const { Text } = Typography;

interface CameraCaptureProps {
    onResult: (data: ParsedOCRData) => void;
    onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onResult, onClose }) => {
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImageDataUrl(reader.result as string);
            setProcessing(true);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                gap: 20,
            }}
        >
            {/* Close button */}
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <Button
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={onClose}
                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white' }}
                />
            </div>

            <Text
                style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    textAlign: 'center',
                }}
            >
                مسح الإيصال
            </Text>

            {!imageDataUrl && (
                <>
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 14,
                            fontFamily: 'Cairo, sans-serif',
                            textAlign: 'center',
                            maxWidth: 280,
                        }}
                    >
                        التقط صورة للإيصال أو اختر صورة من الجهاز
                    </Text>

                    {/* Hidden file inputs */}
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    <Space direction="vertical" size={12} style={{ width: '100%', maxWidth: 300 }}>
                        <Button
                            size="large"
                            icon={<CameraOutlined />}
                            onClick={() => cameraInputRef.current?.click()}
                            style={{
                                width: '100%',
                                height: 56,
                                background: '#1677ff',
                                border: 'none',
                                color: 'white',
                                borderRadius: 14,
                                fontFamily: 'Cairo, sans-serif',
                                fontSize: 16,
                                fontWeight: 700,
                            }}
                        >
                            التقاط صورة
                        </Button>
                        <Button
                            size="large"
                            icon={<UploadOutlined />}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: '100%',
                                height: 56,
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'white',
                                borderRadius: 14,
                                fontFamily: 'Cairo, sans-serif',
                                fontSize: 16,
                            }}
                        >
                            اختر من المعرض
                        </Button>
                    </Space>

                    {/* Tips */}
                    <div
                        style={{
                            maxWidth: 300,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            padding: '14px 16px',
                            marginTop: 8,
                        }}
                    >
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                            💡 نصائح للحصول على نتائج أفضل:
                        </Text>
                        <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 6, paddingRight: 16, fontFamily: 'Cairo, sans-serif' }}>
                            <li>أمسك الهاتف عمودياً فوق الإيصال مباشرةً</li>
                            <li>تأكد من وجود إضاءة كافية</li>
                            <li>تجنب الظلال على الإيصال</li>
                            <li>أملأ الإطار بالإيصال</li>
                        </ul>
                    </div>
                </>
            )}

            {/* Image preview + OCR */}
            {imageDataUrl && processing && (
                <OCRProcessor
                    imageDataUrl={imageDataUrl}
                    onResult={(data: ParsedOCRData) => {
                        setProcessing(false);
                        onResult(data);
                    }}
                    onError={() => {
                        setProcessing(false);
                        setImageDataUrl(null);
                    }}
                />
            )}
        </div>
    );
};

export default CameraCapture;
