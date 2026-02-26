import React, { useEffect, useRef } from 'react';
import { Spin, Typography, Button } from 'antd';
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
 * 1. Scale UP 2× — Tesseract works better on larger images
 * 2. Grayscale + mild contrast boost (1.5)
 * 3. Crop: skip top 40% (handwriting covers ~40% of these photos) and bottom 12%
 *
 * NOTE: Removed sharpening kernel — it can introduce pixel artifacts that confuse Tesseract
 */
function preprocessImage(dataUrl: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const SCALE = 2;
            const canvas = document.createElement('canvas');
            canvas.width = img.width * SCALE;
            canvas.height = img.height * SCALE;
            const ctx = canvas.getContext('2d');
            if (!ctx) { reject(new Error('No canvas context')); return; }
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Grayscale + contrast boost
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imageData.data;
            const contrast = 1.5;
            for (let i = 0; i < d.length; i += 4) {
                const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
                const val = Math.max(0, Math.min(255, contrast * (gray - 128) + 128));
                d[i] = d[i + 1] = d[i + 2] = val;
            }
            ctx.putImageData(imageData, 0, 0);

            // Crop: skip top 40% (handwriting takes ~40% in these photos) and bottom 12%
            const cropY = Math.floor(canvas.height * 0.40);
            const cropH = Math.floor(canvas.height * 0.88) - cropY;
            const cropped = document.createElement('canvas');
            cropped.width = canvas.width;
            cropped.height = cropH;
            const croppedCtx = cropped.getContext('2d');
            if (!croppedCtx) { reject(new Error('No cropped canvas context')); return; }
            croppedCtx.drawImage(canvas, 0, cropY, canvas.width, cropH, 0, 0, canvas.width, cropH);

            resolve(cropped);
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
}

/** Flatten Tesseract v7 nested word hierarchy: blocks→paragraphs→lines→words */
function extractWords(data: any): Array<{
    text: string;
    bbox: { x0: number; y0: number; x1: number; y1: number };
    confidence: number;
}> {
    const words: Array<{
        text: string;
        bbox: { x0: number; y0: number; x1: number; y1: number };
        confidence: number;
    }> = [];
    if (!data.blocks || !Array.isArray(data.blocks)) return words;
    for (const block of data.blocks) {
        for (const para of block.paragraphs ?? []) {
            for (const line of para.lines ?? []) {
                for (const word of line.words ?? []) {
                    const text = word.text?.trim();
                    if (text && text.length > 0) {
                        words.push({ text, bbox: word.bbox, confidence: word.confidence ?? 0 });
                    }
                }
            }
        }
    }
    return words;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ imageDataUrl, onResult, onError }) => {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const run = async () => {
            try {
                const canvas = await preprocessImage(imageDataUrl);

                const worker = await createWorker('eng', 1, {
                    logger: () => { },
                });

                await worker.setParameters({
                    // SPARSE_TEXT: finds as much text as possible without assuming
                    // any specific layout — correct for a 4-column receipt table.
                    tessedit_pageseg_mode: PSM.SPARSE_TEXT,
                });

                const { data } = await worker.recognize(canvas, {}, { blocks: true, text: true });
                await worker.terminate();

                // Always log so we can debug exactly what Tesseract reads
                console.log('[OCR raw text]:\n', data.text);

                const words = extractWords(data);
                console.log('[OCR words]:', words.length, '→', words.map(w => w.text).join(' / '));

                let parsed: ParsedOCRData;
                if (words.length > 5) {
                    // Primary: positional parsing with bbox column matching
                    parsed = parseOCRResult(words);
                    console.log('[OCR positional parse]:', parsed);

                    // If positional parse got very little, supplement with text parse
                    const positionalCount = Object.values(parsed).filter(v => v !== undefined).length;
                    if (positionalCount < 3) {
                        const textParsed = parseOCRText(data.text ?? '');
                        parsed = { ...textParsed, ...parsed }; // positional wins on conflicts
                        console.log('[OCR text parse supplement]:', textParsed);
                    }
                } else {
                    // Fallback: data.blocks was null — parse the raw text string
                    console.log('[OCR] using text fallback (no blocks)');
                    parsed = parseOCRText(data.text ?? '');
                    console.log('[OCR text parse]:', parsed);
                }

                onResult(parsed);
            } catch (err) {
                console.error('[OCR error]:', err);
                onError();
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center gap-4">
            <img
                src={imageDataUrl}
                alt="صورة الإيصال"
                className="max-w-full max-h-[280px] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.10)] opacity-70"
            />
            <Spin size="large" />
            <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
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
