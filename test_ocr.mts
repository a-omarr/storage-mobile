import { parseOCRResult } from '/home/omar/work/StorageApp/src/utils/ocrParser';

// ── Mock data representing Tesseract word extractions ────────────────────────

// Jar Cortas 325 ML
const words1 = [
    { text: 'Jar', bbox: { x0: 100, y0: 100, x1: 200, y1: 150 }, confidence: 99 },
    { text: 'Cortas', bbox: { x0: 210, y0: 100, x1: 350, y1: 150 }, confidence: 99 },
    { text: '325', bbox: { x0: 360, y0: 100, x1: 450, y1: 150 }, confidence: 99 },
    { text: 'ML', bbox: { x0: 460, y0: 100, x1: 520, y1: 150 }, confidence: 99 },

    // Header Row 1
    { text: 'BATCH', bbox: { x0: 100, y0: 200, x1: 200, y1: 230 }, confidence: 99 },
    { text: 'NUMBER', bbox: { x0: 210, y0: 200, x1: 300, y1: 230 }, confidence: 99 },
    { text: 'Item', bbox: { x0: 350, y0: 200, x1: 400, y1: 230 }, confidence: 99 },
    { text: 'No', bbox: { x0: 410, y0: 200, x1: 450, y1: 230 }, confidence: 99 },
    { text: 'COLOR', bbox: { x0: 500, y0: 200, x1: 600, y1: 230 }, confidence: 99 },
    { text: 'QUANTITY', bbox: { x0: 650, y0: 200, x1: 750, y1: 230 }, confidence: 99 },
    { text: 'PER', bbox: { x0: 760, y0: 200, x1: 800, y1: 230 }, confidence: 99 },
    { text: 'LAYER', bbox: { x0: 810, y0: 200, x1: 900, y1: 230 }, confidence: 99 },

    // Value Row 1
    { text: '320-004', bbox: { x0: 150, y0: 250, x1: 250, y1: 280 }, confidence: 99 },
    { text: '320', bbox: { x0: 380, y0: 250, x1: 420, y1: 280 }, confidence: 99 },
    { text: 'FLINT', bbox: { x0: 520, y0: 250, x1: 580, y1: 280 }, confidence: 99 },
    { text: '231', bbox: { x0: 750, y0: 250, x1: 800, y1: 280 }, confidence: 99 },

    // Header Row 2
    { text: 'DATE', bbox: { x0: 100, y0: 300, x1: 180, y1: 330 }, confidence: 99 },
    { text: 'OF', bbox: { x0: 190, y0: 300, x1: 220, y1: 330 }, confidence: 99 },
    { text: 'PRODUCTION', bbox: { x0: 230, y0: 300, x1: 320, y1: 330 }, confidence: 99 },
    { text: 'CAPACITY', bbox: { x0: 350, y0: 300, x1: 450, y1: 330 }, confidence: 99 },
    { text: 'FINISH', bbox: { x0: 500, y0: 300, x1: 580, y1: 330 }, confidence: 99 },
    { text: 'TYPE', bbox: { x0: 590, y0: 300, x1: 650, y1: 330 }, confidence: 99 },
    { text: 'NUMBER', bbox: { x0: 700, y0: 300, x1: 780, y1: 330 }, confidence: 99 },
    { text: 'OF', bbox: { x0: 790, y0: 300, x1: 820, y1: 330 }, confidence: 99 },
    { text: 'LAYERS', bbox: { x0: 830, y0: 300, x1: 900, y1: 330 }, confidence: 99 },

    // Value Row 2 
    { text: '9/8/2025', bbox: { x0: 120, y0: 350, x1: 280, y1: 380 }, confidence: 99 },
    { text: '325', bbox: { x0: 380, y0: 350, x1: 410, y1: 380 }, confidence: 99 },
    { text: 'cc', bbox: { x0: 420, y0: 350, x1: 450, y1: 380 }, confidence: 99 },
    // **MULTI-WORD FINISH TYPE**
    { text: 'TO', bbox: { x0: 520, y0: 350, x1: 550, y1: 380 }, confidence: 99 },
    { text: '63', bbox: { x0: 560, y0: 350, x1: 600, y1: 380 }, confidence: 99 },
    { text: '16', bbox: { x0: 790, y0: 350, x1: 820, y1: 380 }, confidence: 99 },

    // Pieces and Pallet (Right side)
    { text: 'PIECES', bbox: { x0: 700, y0: 400, x1: 760, y1: 430 }, confidence: 99 },
    { text: 'PER', bbox: { x0: 770, y0: 400, x1: 800, y1: 430 }, confidence: 99 },
    { text: 'PALLET', bbox: { x0: 810, y0: 400, x1: 900, y1: 430 }, confidence: 99 },
    { text: '3696', bbox: { x0: 780, y0: 450, x1: 850, y1: 480 }, confidence: 99 },

    { text: 'NUMBER', bbox: { x0: 700, y0: 500, x1: 760, y1: 530 }, confidence: 99 },
    { text: 'OF', bbox: { x0: 770, y0: 500, x1: 800, y1: 530 }, confidence: 99 },
    { text: 'PALLET', bbox: { x0: 810, y0: 500, x1: 900, y1: 530 }, confidence: 99 },
    // **IGNORE SYMBOLS AND EXTRACT RIGHTMOST NUMBER**
    { text: 'M.T./T.T.,H.O.', bbox: { x0: 100, y0: 550, x1: 300, y1: 580 }, confidence: 99 },
    { text: '670', bbox: { x0: 780, y0: 550, x1: 850, y1: 580 }, confidence: 99 }
];

console.log('Testing Jar Cortas receipt parsing...');
const result1 = parseOCRResult(words1);
console.log('--- Result ---');
console.log(result1);

const checks = [
    { label: 'Type', expected: 'Jar Cortas', actual: result1.type },
    { label: 'Finish Type', expected: 'TO 63', actual: result1.finishType },
    { label: 'Color', expected: 'FLINT', actual: result1.color },
    { label: 'Pieces per Pallet', expected: 3696, actual: result1.piecesPerPallet },
    { label: 'Number of Pallets', expected: 670, actual: result1.numberOfPallet },
    { label: 'Quantity Per Layer', expected: 231, actual: result1.qtyPerLayer }
];

let allPassed = true;
checks.forEach(check => {
    if (check.expected !== check.actual) {
        console.error(`❌ Mismatch for ${check.label}: Expected '${check.expected}' but got '${check.actual}'`);
        allPassed = false;
    } else {
        console.log(`✅ ${check.label}: ${check.actual}`);
    }
});

if (allPassed) {
    console.log('🎉 All tests passed successfully!');
} else {
    console.log('❗ Some tests failed.');
}
