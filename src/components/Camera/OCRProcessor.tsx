import React, { useEffect, useRef, useState } from 'react';
import { Spin, Typography, Button, Progress } from 'antd';
import { createWorker, PSM } from 'tesseract.js';
import { parseOCRResult, parseOCRText } from '../../utils/ocrParser';
import type { ParsedOCRData } from '../../utils/ocrParser';

const { Text } = Typography;

interface OCRProcessorProps {
    imageDataUrl: string;
    onResult: (data: ParsedOCRData) => void;
    onError: () => void;
}

/**
 * Pre-processes the image:
 * 1. Scale UP to at least 1200px width (Tesseract works better on larger images)
 * 2. Grayscale + contrast boost (1.5)
 * 3. Crop: skip top 35% (handwriting markers) and bottom 15% (footer noise)
 */
function preprocessImage(dataUrl: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Target width 1200px for better OCR
            const MIN_WIDTH = 1200;
            const scale = img.width < MIN_WIDTH ? MIN_WIDTH / img.width : 1;

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = img.width * scale;
            tempCanvas.height = img.height * scale;
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) { reject(new Error('No canvas context')); return; }

            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

            // Grayscale + contrast boost
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const d = imageData.data;
            const contrast = 1.5;
            for (let i = 0; i < d.length; i += 4) {
                const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
                const val = Math.max(0, Math.min(255, contrast * (gray - 128) + 128));
                d[i] = d[i + 1] = d[i + 2] = val;
            }
            tempCtx.putImageData(imageData, 0, 0);

            resolve(tempCanvas);
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
}

/** Flatten Tesseract v7 nested word hierarchy */
function extractWords(data: any): Array<{
    text: string;
    bbox: { x0: number; y0: number; x1: number; y1: number };
    confidence: number;
}> {
    const words: any[] = [];
    if (!data.blocks) return words;
    for (const block of data.blocks) {
        for (const para of block.paragraphs ?? []) {
            for (const line of para.lines ?? []) {
                for (const word of line.words ?? []) {
                    const text = word.text?.trim();
                    if (text) {
                        words.push({ text, bbox: word.bbox, confidence: word.confidence ?? 0 });
                    }
                }
            }
        }
    }
    return words;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ imageDataUrl, onResult, onError }) => {
    const [progress, setProgress] = useState(0);
    const workerRef = useRef<any>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const run = async () => {
            try {
                const canvas = await preprocessImage(imageDataUrl);

                workerRef.current = await createWorker('eng', 1, {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.floor(m.progress * 100));
                        }
                    },
                });

                await workerRef.current.setParameters({
                    tessedit_pageseg_mode: PSM.SPARSE_TEXT,
                    // Whitelist English characters, numbers, and common arithmetic/date symbols
                    tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-/.: ',
                });

                const { data } = await workerRef.current.recognize(canvas, {}, { blocks: true, text: true });

                const words = extractWords(data);
                console.log('[OCR raw text]:\n', data.text);
                console.log('[OCR words]:', words.length);

                // Calculate average confidence
                const avgConfidence = words.length > 0
                    ? words.reduce((acc, curr) => acc + curr.confidence, 0) / words.length
                    : 0;

                let parsed: ParsedOCRData;
                // Multi-parser strategy: positional first, fallback to text if needed
                if (words.length > 5) {
                    parsed = parseOCRResult(words);
                    const filledCount = Object.values(parsed).filter(v => v !== undefined).length;
                    if (filledCount < 4) {
                        const textParsed = parseOCRText(data.text ?? '');
                        parsed = { ...textParsed, ...parsed };
                    }
                } else {
                    parsed = parseOCRText(data.text ?? '');
                }

                parsed.confidence = avgConfidence;
                onResult(parsed);
            } catch (err) {
                console.error('[OCR error]:', err);
                onError();
            }
        };

        run();

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, [imageDataUrl, onResult, onError]);

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className="relative w-full aspect-[3/4] max-h-[300px] overflow-hidden rounded-2xl shadow-2xl border-2 border-white/20">
                <img
                    src={imageDataUrl}
                    alt="صورة الإيصال"
                    className="w-full h-full object-cover blur-[2px] opacity-60 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Spin size="large" className="mb-4" />
                    <Text className="text-white text-lg font-bold font-['Cairo',sans-serif] block mb-1">
                        جاري تحليل البيانات...
                    </Text>
                    <Text className="text-white/60 text-xs font-['Cairo',sans-serif]">
                        نستخدم تقنيات الذكاء الاصطناعي لقراءة الإيصال
                    </Text>
                </div>
            </div>

            <div className="w-full px-4">
                <div className="flex justify-between items-end mb-2">
                    <Text className="text-white/80 text-xs font-['Cairo',sans-serif]">تقدم المعالجة</Text>
                    <Text className="text-blue-400 text-sm font-bold">{progress}%</Text>
                </div>
                <Progress
                    percent={progress}
                    showInfo={false}
                    strokeColor="#1677ff"
                    trailColor="rgba(255,255,255,0.1)"
                    size="small"
                />
            </div>

            <Button
                type="text"
                onClick={onError}
                className="text-white/40 hover:text-white font-['Cairo',sans-serif] text-sm"
            >
                إلغاء العملية
            </Button>
        </div>
    );
};

export default OCRProcessor;
