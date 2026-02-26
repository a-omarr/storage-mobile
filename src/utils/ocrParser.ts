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

// ── Row grouping ─────────────────────────────────────────────────────────────

/**
 * Group words into rows by proximity of Y-center.
 * Uses a midpoint-based approach so words of different heights stay in the same row.
 */
function groupByRows(words: OCRWord[], threshold = 20): OCRWord[][] {
    const rows: OCRWord[][] = [];

    for (const word of words) {
        const midY = (word.bbox.y0 + word.bbox.y1) / 2;
        let placed = false;

        for (const row of rows) {
            const rowMidY = (row[0].bbox.y0 + row[0].bbox.y1) / 2;
            if (Math.abs(midY - rowMidY) < threshold) {
                row.push(word);
                placed = true;
                break;
            }
        }
        if (!placed) rows.push([word]);
    }

    // Sort rows top-to-bottom, words within each row left-to-right
    rows.sort((a, b) => {
        const aY = (a[0].bbox.y0 + a[0].bbox.y1) / 2;
        const bY = (b[0].bbox.y0 + b[0].bbox.y1) / 2;
        return aY - bY;
    });
    rows.forEach(row => row.sort((a, b) => a.bbox.x0 - b.bbox.x0));

    return rows;
}

function rowText(row: OCRWord[]): string {
    return row.map(w => w.text).join(' ').trim();
}

// ── Column-aware value extraction ─────────────────────────────────────────────

/**
 * Given a header word, find the word in the next row whose X-center is closest.
 * This correctly maps each column header to its specific value cell below it.
 * maxXDist: maximum horizontal distance (in scaled pixels) to consider a match.
 */
function valueBelow(
    headerWord: OCRWord,
    nextRow: OCRWord[],
    maxXDist = 300          // generous — columns can be wide, and 2× scale doubles all coords
): string {
    if (!nextRow || nextRow.length === 0) return '';
    const hMidX = (headerWord.bbox.x0 + headerWord.bbox.x1) / 2;

    let closest: OCRWord | null = null;
    let minDist = Infinity;

    for (const w of nextRow) {
        const wMidX = (w.bbox.x0 + w.bbox.x1) / 2;
        const dist = Math.abs(wMidX - hMidX);
        if (dist < minDist && dist < maxXDist) {
            minDist = dist;
            closest = w;
        }
    }

    return closest ? closest.text.trim() : '';
}

/**
 * When the header spans multiple words (e.g., "QUANTITY PER LAYER"),
 * use the rightmost word as the anchor for column alignment.
 */
function valueBelowMulti(headerWords: OCRWord[], nextRow: OCRWord[]): string {
    const rightmost = [...headerWords].sort((a, b) => b.bbox.x1 - a.bbox.x1)[0];
    return valueBelow(rightmost, nextRow);
}



// ── Fuzzy keyword matching ─────────────────────────────────────────────────────

/**
 * Tesseract sometimes misreads headers (e.g., "BATCH" → "BATCK", "QUANTITY" → "OUANTITY").
 * Use fuzzy matching: check if the word contains at least N consecutive chars of the keyword,
 * or if the keyword is a subsequence of the word (allowing 1-char substitutions).
 */
function fuzzyIncludes(haystack: string, needle: string, minMatch = 4): boolean {
    const h = haystack.toUpperCase();
    const n = needle.toUpperCase();
    if (h.includes(n)) return true;
    // Check if n is a partial substring of h (at least minMatch chars matching)
    if (n.length >= minMatch) {
        for (let start = 0; start <= n.length - minMatch; start++) {
            if (h.includes(n.slice(start, start + minMatch))) return true;
        }
    }
    return false;
}

function findHeaderWord(row: OCRWord[], keyword: string): OCRWord | undefined {
    return row.find(w => fuzzyIncludes(w.text, keyword));
}

// ── Number extraction ─────────────────────────────────────────────────────────

function extractNumber(str: string): number | undefined {
    const match = str.replace(/,/g, '').replace(/O/g, '0').match(/\d+/);
    return match ? parseInt(match[0]) : undefined;
}

// ── Main parser ───────────────────────────────────────────────────────────────

/**
 * Parses Tesseract word-level results into structured product fields.
 * Designed for the MCG receipt layout:
 *
 *   ROW: [Product Name]   [Capacity e.g. 750 ML]
 *   ROW: BATCH NUMBER | Item No | COLOR | QUANTITY PER LAYER
 *   ROW: 264-006      | 264    | Flint | 233
 *   ROW: DATE OF PRODUCTION | CAPACITY | FINISH TYPE | NUMBER OF LAYERS
 *   ROW: 9/11/2024          | 750 CC   | CORK        | 7
 *   ROW: [icons - ignored]
 *   ROW: M.T./K.A.,H.O.    |          | PIECES PER PALLET
 *   ROW: (empty left)                  | 1631
 *   ROW: (empty left)                  | NUMBER OF PALLET
 *   ROW: (empty left)                  | 1108
 */
export function parseOCRResult(words: OCRWord[]): ParsedOCRData {
    const result: ParsedOCRData = {};
    if (words.length === 0) return result;

    const rows = groupByRows(words, 20);

    console.log('[ocrParser] rows:', rows.map(r => rowText(r)));

    // ── Product title: first row(s) with a capacity pattern ─────────────────
    for (let i = 0; i < Math.min(5, rows.length); i++) {
        const text = rowText(rows[i]);
        const capMatch = text.match(/(\d+(?:\.\d+)?)\s*(ML|CC|CL|L)\b/i);
        if (capMatch) {
            result.capacity = `${capMatch[1]} ${capMatch[2].toUpperCase()}`;
            const before = text.slice(0, text.indexOf(capMatch[0])).trim();
            if (before.length > 0) result.type = before;
            break;
        }
    }

    // ── Scan rows for known headers, extract value from row below ────────────
    for (let i = 0; i < rows.length - 1; i++) {
        const text = rowText(rows[i]).toUpperCase();
        const nextRow = rows[i + 1];

        // BATCH NUMBER
        if (fuzzyIncludes(text, 'BATCH')) {
            const hw = findHeaderWord(rows[i], 'BATCH');
            if (hw) {
                const val = valueBelow(hw, nextRow);
                if (val && /[\d\-]/.test(val)) result.batchNumber = val;
            }
        }

        // ITEM NO / ALTERNATIVE NO
        if (fuzzyIncludes(text, 'ITEM') || fuzzyIncludes(text, 'ALT')) {
            const hw = findHeaderWord(rows[i], 'ITEM') ?? findHeaderWord(rows[i], 'ALT');
            if (hw) {
                const val = valueBelow(hw, nextRow);
                if (val) result.itemNo = val.replace(/[^0-9\-]/g, '') || val;
            }
        }

        // COLOR
        if (fuzzyIncludes(text, 'COLOR')) {
            const hw = findHeaderWord(rows[i], 'COLOR');
            if (hw) {
                const val = valueBelow(hw, nextRow);
                if (val) result.color = val;
            }
        }

        // QUANTITY PER LAYER
        if (fuzzyIncludes(text, 'QUANT') || fuzzyIncludes(text, 'QTY')) {
            const hws = rows[i].filter(w =>
                fuzzyIncludes(w.text, 'QUANT') ||
                fuzzyIncludes(w.text, 'QTY') ||
                fuzzyIncludes(w.text, 'LAYER')
            );
            if (hws.length > 0) {
                const val = valueBelowMulti(hws, nextRow);
                const num = extractNumber(val);
                if (num !== undefined) result.qtyPerLayer = num;
            }
        }

        // DATE OF PRODUCTION
        if (fuzzyIncludes(text, 'DATE')) {
            const hw = findHeaderWord(rows[i], 'DATE');
            if (hw) {
                const val = valueBelow(hw, nextRow);
                if (val) {
                    const parsed = parseOCRDate(val);
                    if (parsed) result.dateOfProduction = parsed;
                }
            }
        }

        // CAPACITY (as column header, not title row)
        if (fuzzyIncludes(text, 'CAPAC') && !result.capacity) {
            const hw = findHeaderWord(rows[i], 'CAPAC');
            if (hw) {
                const val = valueBelow(hw, nextRow);
                if (val) result.capacity = val;
            }
        }

        // FINISH TYPE
        if (fuzzyIncludes(text, 'FINISH')) {
            const hw = findHeaderWord(rows[i], 'FINISH');
            if (hw) {
                const val = valueBelow(hw, nextRow);
                if (val) result.finishType = val;
            }
        }

        // NUMBER OF LAYERS (not QUANTITY PER LAYER)
        if ((fuzzyIncludes(text, 'LAYER') || fuzzyIncludes(text, 'LAYERS')) &&
            !fuzzyIncludes(text, 'QUANT') && !fuzzyIncludes(text, 'QTY')) {
            const hw = findHeaderWord(rows[i], 'LAYER');
            if (hw) {
                const val = valueBelow(hw, nextRow);
                const num = extractNumber(val);
                if (num !== undefined) result.numberOfLayers = num;
            }
        }

        // PIECES PER PALLET — value is the rightmost word in the next row
        if (fuzzyIncludes(text, 'PIECE') || fuzzyIncludes(text, 'PCS')) {
            const rightmost = nextRow[nextRow.length - 1];
            if (rightmost) {
                const num = extractNumber(rightmost.text);
                if (num !== undefined) result.piecesPerPallet = num;
            }
        }

        // NUMBER OF PALLET — value is the rightmost word in the next row
        // Must NOT also match "PIECES PER PALLET"
        if (fuzzyIncludes(text, 'PALLET') &&
            !fuzzyIncludes(text, 'PIECE') && !fuzzyIncludes(text, 'PCS')) {
            const rightmost = nextRow[nextRow.length - 1];
            if (rightmost) {
                const num = extractNumber(rightmost.text);
                if (num !== undefined) result.numberOfPallet = num;
            }
        }
    }

    return result;
}

// ── Text-line fallback parser ──────────────────────────────────────────────────

/**
 * Fallback parser used when data.blocks is null (Tesseract.js sometimes returns null blocks).
 * Parses data.text — the plain text string that Tesseract ALWAYS populates.
 *
 * Strategy: scan lines for known header keywords, grab value from the NEXT non-empty line.
 * This is less accurate than positional parsing (can't do column matching),
 * but reliable since the receipt always has the same row order.
 */
export function parseOCRText(rawText: string): ParsedOCRData {
    const result: ParsedOCRData = {};
    if (!rawText) return result;

    // Strip lines that are clearly Arabic or just symbols/whitespace
    const lines = rawText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 1 && /[A-Za-z0-9]/.test(l)); // keep only lines with latin/digits

    const up = (s: string) => s.toUpperCase();

    const nextLine = (idx: number): string => {
        for (let j = idx + 1; j < lines.length; j++) {
            if (lines[j].trim().length > 0) return lines[j].trim();
        }
        return '';
    };

    for (let i = 0; i < lines.length; i++) {
        const line = up(lines[i]);

        // Product title + capacity — first line with "ML" or "CC"
        if (!result.type) {
            const capMatch = lines[i].match(/(\d+(?:\.\d+)?)\s*(ML|CC|CL|L)\b/i);
            if (capMatch) {
                result.capacity = `${capMatch[1]} ${capMatch[2].toUpperCase()}`;
                const before = lines[i].slice(0, lines[i].indexOf(capMatch[0])).trim();
                if (before.length > 0) result.type = before;
            }
        }

        // BATCH NUMBER
        if (fuzzyIncludes(line, 'BATCH') && !result.batchNumber) {
            // The header row has all 4 headers: "BATCH NUMBER Item No COLOR QUANTITY PER LAYER"
            // The next line has all 4 values: "264-006 264 Flint 233"
            const next = nextLine(i);
            if (next) {
                const parts = next.split(/\s+/);
                // BATCH value: looks like "264-006" (has a hyphen or multiple digits)
                const batch = parts.find(p => /\d+[-]\d+/.test(p) || /^\d{3,}/.test(p));
                if (batch) result.batchNumber = batch;
                // Item No: a standalone number
                const itemNo = parts.find(p => /^\d{2,4}$/.test(p) && p !== batch);
                if (itemNo && !result.itemNo) result.itemNo = itemNo;
                // Color: a word, not a number
                const color = parts.find(p => /^[A-Za-z]+$/.test(p) && p.length > 2);
                if (color && !result.color) result.color = color;
                // Qty per layer: last number on the line
                const nums = parts.filter(p => /^\d+$/.test(p));
                if (nums.length > 0 && !result.qtyPerLayer) {
                    result.qtyPerLayer = parseInt(nums[nums.length - 1]);
                }
            }
        }

        // DATE OF PRODUCTION
        if (fuzzyIncludes(line, 'DATE') && !result.dateOfProduction) {
            const next = nextLine(i);
            if (next) {
                // Extract date pattern d/m/yyyy or dd/mm/yyyy
                const dateMatch = next.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/);
                if (dateMatch) {
                    const parsed = parseOCRDate(dateMatch[0]);
                    if (parsed) result.dateOfProduction = parsed;
                }
                // CAPACITY column is also on the next line — looks like "750 CC"
                if (!result.capacity) {
                    const capMatch = next.match(/(\d+(?:\.\d+)?)\s*(ML|CC|CL|L)\b/i);
                    if (capMatch) result.capacity = `${capMatch[1]} ${capMatch[2].toUpperCase()}`;
                }
                // FINISH TYPE column — a word like "CORK", "SCREW"
                const words = next.split(/\s+/);
                const finish = words.find(w => /^[A-Z]{3,}$/.test(w.toUpperCase()) &&
                    !/(ML|CC|CL|L|\d)/.test(w));
                if (finish && !result.finishType) result.finishType = finish;
                // NUMBER OF LAYERS — last number on the line
                const nums = next.match(/\d+/g);
                if (nums && nums.length > 0 && !result.numberOfLayers) {
                    result.numberOfLayers = parseInt(nums[nums.length - 1]);
                }
            }
        }

        // PIECES PER PALLET
        if ((fuzzyIncludes(line, 'PIECE') || fuzzyIncludes(line, 'PCS')) && !result.piecesPerPallet) {
            const next = nextLine(i);
            const num = extractNumber(next);
            if (num !== undefined) result.piecesPerPallet = num;
        }

        // NUMBER OF PALLET (not pieces)
        if (fuzzyIncludes(line, 'PALLET') &&
            !fuzzyIncludes(line, 'PIECE') && !fuzzyIncludes(line, 'PCS') &&
            !result.numberOfPallet) {
            const next = nextLine(i);
            const num = extractNumber(next);
            if (num !== undefined) result.numberOfPallet = num;
        }
    }

    return result;
}
