import { parseOCRDate } from './dateHelpers';

interface OCRWord {
    text: string;
    bbox: { x0: number; y0: number; x1: number; y1: number };
    confidence: number;
}

export interface ParsedOCRData {
    type?: string;
    capacity?: string;
    itemNo?: string;
    batchNumber?: string;
    color?: string;
    finishType?: string;
    qtyPerLayer?: number;
    numberOfLayers?: number;
    piecesPerPallet?: number;
    numberOfPallet?: number;
    dateOfProduction?: Date;
}

// Group words into rows by proximity of Y coordinates
function groupByRows(words: OCRWord[], threshold = 15): OCRWord[][] {
    const sorted = [...words].sort((a, b) => a.bbox.y0 - b.bbox.y0);
    const rows: OCRWord[][] = [];
    let currentRow: OCRWord[] = [];

    for (const word of sorted) {
        if (currentRow.length === 0) {
            currentRow.push(word);
        } else {
            const lastY = currentRow[currentRow.length - 1].bbox.y0;
            if (Math.abs(word.bbox.y0 - lastY) <= threshold) {
                currentRow.push(word);
            } else {
                rows.push(currentRow.sort((a, b) => a.bbox.x0 - b.bbox.x0));
                currentRow = [word];
            }
        }
    }
    if (currentRow.length > 0) {
        rows.push(currentRow.sort((a, b) => a.bbox.x0 - b.bbox.x0));
    }
    return rows;
}

// Combine words in a row into a single string
function rowText(row: OCRWord[]): string {
    return row.map((w) => w.text).join(' ').trim();
}



// Get the value row immediately below the header row at similar X position
function getValueBelow(rows: OCRWord[][], headerIdx: number): string {
    if (headerIdx + 1 >= rows.length) return '';
    return rowText(rows[headerIdx + 1]);
}

// Extract numeric value from a string
function extractNumber(str: string): number | undefined {
    const match = str.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0]) : undefined;
}

/**
 * Main parser — takes Tesseract word-level results and extracts product fields
 */
export function parseOCRResult(words: OCRWord[]): ParsedOCRData {
    const result: ParsedOCRData = {};
    const rows = groupByRows(words, 18);

    // First row or two: usually the product title e.g. "Bordeaux 750 ML"
    // Look in the first 3 rows for something that looks like a product name + capacity
    for (let i = 0; i < Math.min(3, rows.length); i++) {
        const text = rowText(rows[i]);
        // Capacity pattern: digits + ML or CL or L
        const capMatch = text.match(/(\d+(?:\.\d+)?)\s*(ML|CL|L)\b/i);
        if (capMatch) {
            result.capacity = `${capMatch[1]} ${capMatch[2].toUpperCase()}`;
            // Type = everything before the capacity match
            const before = text.slice(0, text.indexOf(capMatch[0])).trim();
            if (before.length > 0) result.type = before;
            break;
        }
    }

    // Scan through rows looking for field headers
    for (let i = 0; i < rows.length; i++) {
        const text = rowText(rows[i]).toUpperCase();

        if (text.includes('BATCH NUMBER') || text.includes('BATCH NO')) {
            const val = getValueBelow(rows, i);
            if (val) result.batchNumber = val.trim();
        }

        if (text.includes('ALTERNATIVE NO') || text.includes('ITEM NO') || text.includes('ALT NO')) {
            const val = getValueBelow(rows, i);
            if (val) result.itemNo = val.replace(/[^0-9\-]/g, '').trim() || val.trim();
        }

        if (text.includes('COLOR')) {
            const val = getValueBelow(rows, i);
            if (val) result.color = val.trim();
        }

        if (text.includes('FINISH TYPE') || text.includes('FINISH')) {
            const val = getValueBelow(rows, i);
            if (val) result.finishType = val.trim();
        }

        if (text.includes('QUANTITY PER LAYER') || text.includes('QTY PER LAYER') || text.includes('QTY/LAYER')) {
            const val = getValueBelow(rows, i);
            const num = extractNumber(val);
            if (num !== undefined) result.qtyPerLayer = num;
        }

        if (text.includes('NUMBER OF LAYERS') || text.includes('NO OF LAYERS') || (text.includes('LAYERS') && !text.includes('QTY'))) {
            // Avoid matching "QTY PER LAYER" again
            if (!text.includes('QTY')) {
                const val = getValueBelow(rows, i);
                const num = extractNumber(val);
                if (num !== undefined) result.numberOfLayers = num;
            }
        }

        if (text.includes('PIECES PER PALLET') || text.includes('PCS/PALLET') || text.includes('PIECES/PALLET')) {
            const val = getValueBelow(rows, i);
            const num = extractNumber(val);
            if (num !== undefined) result.piecesPerPallet = num;
        }

        if (text.includes('NUMBER OF PALLET') || text.includes('NO OF PALLET') || text.includes('NO. OF PALLET')) {
            const val = getValueBelow(rows, i);
            const num = extractNumber(val);
            if (num !== undefined) result.numberOfPallet = num;
        }

        if (text.includes('DATE OF PRODUCTION') || text.includes('PRODUCTION DATE') || text.includes('PROD DATE')) {
            const val = getValueBelow(rows, i);
            if (val) {
                const parsed = parseOCRDate(val.trim());
                if (parsed) result.dateOfProduction = parsed;
            }
        }

        // Also look for capacity in the same row as CAPACITY header
        if (text.includes('CAPACITY') && !result.capacity) {
            const val = getValueBelow(rows, i);
            if (val) result.capacity = val.trim();
        }
    }

    return result;
}
