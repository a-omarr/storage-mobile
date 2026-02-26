import React, { useRef, useState, useCallback } from 'react';
import { Button, Space, Typography } from 'antd';
import { FiCamera, FiUploadCloud, FiX, FiInfo } from 'react-icons/fi';
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

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset the input value so the same file can be re-selected later
        e.target.value = '';

        const reader = new FileReader();
        reader.onload = () => {
            setImageDataUrl(reader.result as string);
            setProcessing(true);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleRetry = useCallback(() => {
        setImageDataUrl(null);
        setProcessing(false);
    }, []);

    const handleOCRResult = useCallback((data: ParsedOCRData) => {
        setProcessing(false);
        onResult(data);
    }, [onResult]);

    return (
        <div className="fixed inset-0 bg-black/85 z-[9999] flex flex-col items-center justify-center p-5 gap-5">
            {/* Close button */}
            <div className="absolute top-4 left-4">
                <Button
                    shape="circle"
                    icon={<FiX />}
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
                    {/* Camera input: opens camera directly on mobile */}
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {/* Gallery input: no capture attr → opens the file/gallery picker */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <Space direction="vertical" size={12} style={{ width: '100%', maxWidth: 300 }}>
                        <Button
                            size="large"
                            icon={<FiCamera />}
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
                            icon={<FiUploadCloud />}
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
                    <div className="max-w-[300px] bg-white/10 rounded-[12px] px-4 py-3.5 mt-2">
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                            <FiInfo className="inline ml-1" /> نصائح للحصول على نتائج أفضل:
                        </Text>
                        <ul className="text-white/70 text-xs mt-1.5 pr-4 font-['Cairo',sans-serif]">
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
                    onResult={handleOCRResult}
                    onError={handleRetry}
                />
            )}
        </div>
    );
};

export default CameraCapture;
