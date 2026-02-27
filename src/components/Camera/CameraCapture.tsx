import React, { useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button, Typography } from 'antd';
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

    return createPortal(
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

            <Text className="text-white text-xl font-bold font-['Cairo',sans-serif] text-center">
                مسح الإيصال
            </Text>

            {!imageDataUrl && (
                <div className="flex flex-col items-center w-full max-w-sm px-4">
                    <Text className="text-white/70 text-sm font-['Cairo',sans-serif] text-center mb-6">
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

                    <div className="flex flex-col gap-3 w-full mb-6">
                        <Button
                            size="large"
                            icon={<FiCamera />}
                            onClick={() => cameraInputRef.current?.click()}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 border-none text-white rounded-xl font-['Cairo',sans-serif] text-base font-bold shadow-lg"
                        >
                            التقاط صورة
                        </Button>
                        <Button
                            size="large"
                            icon={<FiUploadCloud />}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-14 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl font-['Cairo',sans-serif] text-base backdrop-blur-sm transition-all"
                        >
                            اختر من المعرض
                        </Button>
                    </div>

                    {/* Tips */}
                    <div className="w-full bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-inner">
                        <Text className="text-white/90 font-['Cairo',sans-serif] text-sm font-semibold flex items-center mb-2">
                            <FiInfo className="ml-2 text-blue-400" /> نصائح للحصول على نتائج أفضل:
                        </Text>
                        <ul className="text-white/70 text-xs space-y-2 pr-5 list-disc font-['Cairo',sans-serif]">
                            <li>أمسك الهاتف عمودياً فوق الإيصال مباشرةً</li>
                            <li>تأكد من وجود إضاءة كافية</li>
                            <li>تجنب الظلال على الإيصال</li>
                            <li>أملأ الإطار بالإيصال</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Image preview + OCR */}
            {imageDataUrl && processing && (
                <OCRProcessor
                    imageDataUrl={imageDataUrl}
                    onResult={handleOCRResult}
                    onError={handleRetry}
                />
            )}
        </div>,
        document.body
    );
};

export default CameraCapture;
