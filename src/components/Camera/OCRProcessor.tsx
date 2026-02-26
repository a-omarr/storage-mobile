import React, { useEffect, useRef } from 'react';
import { Spin, Typography, Button } from 'antd';
import { createWorker } from 'tesseract.js';
import { parseOCRResult } from '../../utils/ocrParser';
import type { ParsedOCRData } from '../../utils/ocrParser';

const { Text } = Typography;

interface OCRProcessorProps {
    imageDataUrl: string;
    onResult: (data: ParsedOCRData) => void;
    onError: () => void;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ imageDataUrl, onResult, onError }) => {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const run = async () => {
            try {
                const worker = await createWorker('eng', 1, {
                    logger: () => { }, // suppress logs
                });
                const { data } = await worker.recognize(imageDataUrl);
                await worker.terminate();

                // data.words has bbox info for positional parsing
                const words = (data as any).words.map((w: any) => ({
                    text: w.text,
                    bbox: w.bbox,
                    confidence: w.confidence,
                }));

                const parsed = parseOCRResult(words);
                onResult(parsed);
            } catch (err) {
                console.error('OCR error:', err);
                onError();
            }
        };

        run();
    }, [imageDataUrl, onResult, onError]);

    return (
        <div className="flex flex-col items-center gap-4">
            <img
                src={imageDataUrl}
                alt="صورة الإيصال"
                className="max-w-full max-h-[280px] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.10)] opacity-70"
            />
            <Spin size="large" />
            <Text
                style={{
                    color: 'white',
                    fontSize: 18,
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 600,
                }}
            >
                جاري قراءة البيانات...
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Cairo, sans-serif' }}>
                قد يستغرق هذا بضع ثوانٍ
            </Text>
            <Button
                type="text"
                onClick={onError}
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Cairo, sans-serif' }}
            >
                إلغاء
            </Button>
        </div>
    );
};

export default OCRProcessor;
