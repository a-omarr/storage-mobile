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

// ── Constants ─────────────────────────────────────────────────────────────────

/**
 * Known multi-word column headers on the receipt.
 * Order matters — longer/more specific headers first.
 */
const MULTI_WORD_HEADERS = [
    'QUANTITY PER LAYER',
    'NUMBER OF LAYERS',
    'NUMBER OF PALLET',
    'PIECES PER PALLET',
    'DATE OF PRODUCTION',
    'FINISH TYPE',
    'BATCH NUMBER',
    'ITEM NO',
];

// ── Row grouping ──────────────────────────────────────────────────────────────

/**
 * Groups words into rows by proximity of Y-center.
 * Uses midpoint-based approach so words of different heights stay in the same row.
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

// ── Column boundary detection (FIX 3) ────────────────────────────────────────

/**
 * Creates column boundaries based on header word positions.
 * Correctly handles multi-word headers like "QUANTITY PER LAYER" as a single column
 * instead of creating a boundary per word.
 */
function getColumnBoundaries(row: OCRWord[]): { keyword: string; minX: number; maxX: number }[] {
    const sorted = [...row].sort((a, b) => a.bbox.x0 - b.bbox.x0);
    const usedIndices = new Set<number>();
    const boundaries: { keyword: string; minX: number; maxX: number }[] = [];

    for (let i = 0; i < sorted.length; i++) {
        if (usedIndices.has(i)) continue;

        // Check if this word starts a known multi-word header
        let headerLength = 1;
        const currentWordUp = sorted[i].text.toUpperCase();

        for (const header of MULTI_WORD_HEADERS) {
            const headerWords = header.split(' ');
            if (currentWordUp !== headerWords[0]) continue;

            // Check if the following words match the rest of the header
            let match = true;
            for (let k = 1; k < headerWords.length; k++) {
                if (!sorted[i + k] || sorted[i + k].text.toUpperCase() !== headerWords[k]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                headerLength = headerWords.length;
                break;
            }
        }

        // Mark subsequent words of multi-word header as used
        for (let k = 1; k < headerLength; k++) usedIndices.add(i + k);

        // Column starts at the first word of the header
        // Column ends just before the next unmerged header starts
        const nextUnmergedIdx = i + headerLength;
        const minX = sorted[i].bbox.x0 - 50;
        const maxX = nextUnmergedIdx < sorted.length
            ? sorted[nextUnmergedIdx].bbox.x0 - 30
            : Infinity;

        boundaries.push({ keyword: sorted[i].text, minX, maxX });
    }

    return boundaries;
}

/**
 * Extracts all words from the next row that fall within the specified X boundaries.
 */
function extractColumnValue(nextRow: OCRWord[], minX: number, maxX: number): string {
    if (!nextRow) return '';
    const wordsInColumn = nextRow.filter(w => {
        const midX = (w.bbox.x0 + w.bbox.x1) / 2;
        return midX > minX && midX < maxX;
    });
    return wordsInColumn.map(w => w.text).join(' ').trim();
}

// ── Fuzzy keyword matching ────────────────────────────────────────────────────

function fuzzyIncludes(haystack: string, needle: string, minMatch = 4): boolean {
    const h = haystack.toUpperCase();
    const n = needle.toUpperCase();
    if (h.includes(n)) return true;
    if (n.length >= minMatch) {
        for (let start = 0; start <= n.length - minMatch; start++) {
            if (h.includes(n.slice(start, start + minMatch))) return true;
        }
    }
    return false;
}

// ── Number extraction ─────────────────────────────────────────────────────────

function extractNumber(str: string): number | undefined {
    // Replace common OCR mistakes: O→0, I→1, l→1
    const cleaned = str.replace(/,/g, '').replace(/O/g, '0').replace(/[Il]/g, '1');
    const match = cleaned.match(/\d+/);
    return match ? parseInt(match[0]) : undefined;
}

// ── Finish type extraction (FIX 1) ───────────────────────────────────────────

/**
 * Extracts finish type from the DATE row value line.
 * Handles multi-word finish types like "28 pp" and "TO 63" which the old
 * alphabetic-only regex would miss entirely.
 * Strategy: grab everything between the capacity value (e.g. "750 CC") and
 * the layers number at the end of the line.
 */
function extractFinishType(line: string): string | undefined {
    // Pattern: <date> <capacity like "750 CC"> <finish type> <number of layers>
    // We want the part between the capacity and the trailing number
    const finishMatch = line.match(/(?:\d+\s*(?:CC|ML|CL|L))\s+(.+?)\s+\d+\s*$/i);
    if (finishMatch) return finishMatch[1].trim();

    // Fallback: pure alpha word like "CORK", "SCREW" — original approach
    const words = line.split(/\s+/);
    const finish = words.find(w =>
        /^[A-Z]{3,}$/.test(w.toUpperCase()) &&
        !/(ML|CC|CL|^L$|\d)/.test(w)
    );
    return finish ?? undefined;
}

// ── Item No extraction (FIX 2) ───────────────────────────────────────────────

/**
 * Extracts item no from the BATCH row value line.
 * Old approach used a regex that could confuse item no with other numbers.
 * New approach: batch is always first (has a hyphen), item no is always
 * the immediate next standalone number after the batch.
 */
function extractItemNo(parts: string[], batchValue: string): string | undefined {
    const batchIdx = parts.findIndex(p => p === batchValue);
    if (batchIdx !== -1 && parts[batchIdx + 1]) {
        const candidate = parts[batchIdx + 1];
        if (/^\d{2,4}$/.test(candidate)) return candidate;
    }
    // Fallback: find first standalone number that isn't the batch
    return parts.find(p => /^\d{2,4}$/.test(p) && p !== batchValue);
}

// ── Main positional parser ────────────────────────────────────────────────────

export function parseOCRResult(words: OCRWord[]): ParsedOCRData {
    const result: ParsedOCRData = {};
    if (words.length === 0) return result;

    const rows = groupByRows(words, 20);
    console.log('[ocrParser] rows:', rows.map(r => rowText(r)));

    // ── Product title + capacity ──────────────────────────────────────────────
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

    // ── Scan rows using column boundaries ────────────────────────────────────
    for (let i = 0; i < rows.length - 1; i++) {
        const row = rows[i];
        const nextRow = rows[i + 1];
        const text = rowText(row).toUpperCase();

        const isHeaderRow =
            fuzzyIncludes(text, 'BATCH') ||
            fuzzyIncludes(text, 'DATE') ||
            fuzzyIncludes(text, 'PIECE');

        if (!isHeaderRow) continue;

        const boundaries = getColumnBoundaries(row);

        // BATCH NUMBER
        const batchBounds = boundaries.find(b => fuzzyIncludes(b.keyword, 'BATCH'));
        if (batchBounds) {
            const val = extractColumnValue(nextRow, batchBounds.minX, batchBounds.maxX);
            if (val && /[\d\-]/.test(val)) result.batchNumber = val.split(' ')[0];
        }

        // ITEM NO — position-based (FIX 2)
        const itemBounds = boundaries.find(b =>
            fuzzyIncludes(b.keyword, 'ITEM') || fuzzyIncludes(b.keyword, 'ALT')
        );
        if (itemBounds) {
            const val = extractColumnValue(nextRow, itemBounds.minX, itemBounds.maxX);
            if (val) {
                const cleaned = val.replace(/[^0-9\-]/g, '');
                if (cleaned) result.itemNo = cleaned;
            }
        }

        // COLOR
        const colorBounds = boundaries.find(b => fuzzyIncludes(b.keyword, 'COLOR'));
        if (colorBounds && !result.color) {
            const val = extractColumnValue(nextRow, colorBounds.minX, colorBounds.maxX);
            if (val) result.color = val;
        }

        // QUANTITY PER LAYER — now correctly treated as single column (FIX 3)
        const qtyBounds = boundaries.find(b =>
            fuzzyIncludes(b.keyword, 'QUANT') || fuzzyIncludes(b.keyword, 'QTY')
        );
        if (qtyBounds && !result.qtyPerLayer) {
            const val = extractColumnValue(nextRow, qtyBounds.minX, Infinity);
            const num = extractNumber(val);
            if (num !== undefined) result.qtyPerLayer = num;
        }

        // DATE OF PRODUCTION
        const dateBounds = boundaries.find(b => fuzzyIncludes(b.keyword, 'DATE'));
        if (dateBounds) {
            const val = extractColumnValue(nextRow, dateBounds.minX, dateBounds.maxX);
            if (val) {
                const parsed = parseOCRDate(val);
                if (parsed) result.dateOfProduction = parsed;
            }
        }

        // CAPACITY as column header (only if not already found from title row)
        const capBounds = boundaries.find(b => fuzzyIncludes(b.keyword, 'CAPAC'));
        if (capBounds && !result.capacity) {
            const val = extractColumnValue(nextRow, capBounds.minX, capBounds.maxX);
            if (val) result.capacity = val;
        }

        // FINISH TYPE — now uses improved extraction (FIX 1)
        const finishBounds = boundaries.find(b => fuzzyIncludes(b.keyword, 'FINISH'));
        if (finishBounds && !result.finishType) {
            const val = extractColumnValue(nextRow, finishBounds.minX, finishBounds.maxX);
            if (val) result.finishType = val;
        }

        // NUMBER OF LAYERS — now correctly single column (FIX 3)
        const layerBounds = boundaries.find(b =>
            fuzzyIncludes(b.keyword, 'LAYER') &&
            !fuzzyIncludes(b.keyword, 'QUANT')
        );
        if (layerBounds && !result.numberOfLayers) {
            const val = extractColumnValue(nextRow, layerBounds.minX, Infinity);
            const num = extractNumber(val);
            if (num !== undefined) result.numberOfLayers = num;
        }

        // PIECES PER PALLET — now correctly single column (FIX 3)
        const piecesBounds = boundaries.find(b =>
            fuzzyIncludes(b.keyword, 'PIECE') || fuzzyIncludes(b.keyword, 'PCS')
        );
        if (piecesBounds && !result.piecesPerPallet) {
            const val = extractColumnValue(nextRow, piecesBounds.minX - 100, Infinity);
            const num = extractNumber(val);
            if (num !== undefined) result.piecesPerPallet = num;
        }

        // NUMBER OF PALLET — now correctly single column (FIX 3)
        const palletBounds = boundaries.find(b =>
            fuzzyIncludes(b.keyword, 'PALLET') &&
            !fuzzyIncludes(b.keyword, 'PIECE') &&
            !fuzzyIncludes(b.keyword, 'PCS')
        );
        if (palletBounds && !result.numberOfPallet) {
            const val = extractColumnValue(nextRow, palletBounds.minX - 100, Infinity);
            const num = extractNumber(val);
            if (num !== undefined) result.numberOfPallet = num;
        }
    }

    return result;
}

// ── Text-line fallback parser ─────────────────────────────────────────────────

/**
 * Fallback parser used when Tesseract returns null blocks.
 * Parses data.text — the plain string Tesseract always populates.
 * Less accurate than positional parsing but reliable for this known receipt format.
 */
export function parseOCRText(rawText: string): ParsedOCRData {
    const result: ParsedOCRData = {};
    if (!rawText) return result;

    // Keep only lines with Latin characters or digits — strips Arabic and blank lines
    const lines = rawText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 1 && /[A-Za-z0-9]/.test(l));

    const up = (s: string) => s.toUpperCase();

    const nextLine = (idx: number): string => {
        for (let j = idx + 1; j < lines.length; j++) {
            if (lines[j].trim().length > 0) return lines[j].trim();
        }
        return '';
    };

    for (let i = 0; i < lines.length; i++) {
        const line = up(lines[i]);

        // ── Product title + capacity ──────────────────────────────────────────
        if (!result.type) {
            const capMatch = lines[i].match(/(\d+(?:\.\d+)?)\s*(ML|CC|CL|L)\b/i);
            if (capMatch) {
                result.capacity = `${capMatch[1]} ${capMatch[2].toUpperCase()}`;
                const before = lines[i].slice(0, lines[i].indexOf(capMatch[0])).trim();
                if (before.length > 0) result.type = before;
            }
        }

        // ── BATCH NUMBER row ──────────────────────────────────────────────────
        // Value row: "264-006  264  Flint  233"
        if (fuzzyIncludes(line, 'BATCH') && !result.batchNumber) {
            const next = nextLine(i);
            if (next) {
                const parts = next.split(/\s+/);

                // Batch: first token with a hyphen like "264-006"
                const batch = parts.find(p => /\d+[-]\d+/.test(p));
                if (batch) result.batchNumber = batch;

                // Item No: token immediately after batch (FIX 2)
                if (batch) {
                    const itemNo = extractItemNo(parts, batch);
                    if (itemNo && !result.itemNo) result.itemNo = itemNo;
                }

                // Color: first purely alphabetic word (length > 2), not a number
                const color = parts.find(p =>
                    /^[A-Za-z]+$/.test(p) &&
                    p.length > 2 &&
                    !['AND', 'FOR', 'THE', 'PER'].includes(p.toUpperCase())
                );
                if (color && !result.color) result.color = color;

                // Qty per layer: last number on the line
                const nums = parts.filter(p => /^\d+$/.test(p));
                if (nums.length > 0 && !result.qtyPerLayer) {
                    result.qtyPerLayer = parseInt(nums[nums.length - 1]);
                }
            }
        }

        // ── DATE OF PRODUCTION row ────────────────────────────────────────────
        // Value row: "9/11/2024  750 CC  CORK  7"
        //            "5/8/2024   600 CC  28 pp  8"
        //            "9/8/2025   325 cc  TO 63  16"
        if (fuzzyIncludes(line, 'DATE') && !result.dateOfProduction) {
            const next = nextLine(i);
            if (next) {
                // Date
                const dateMatch = next.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/);
                if (dateMatch) {
                    const parsed = parseOCRDate(dateMatch[0]);
                    if (parsed) result.dateOfProduction = parsed;
                }

                // Capacity (only if not found from title)
                if (!result.capacity) {
                    const capMatch = next.match(/(\d+(?:\.\d+)?)\s*(ML|CC|CL|L)\b/i);
                    if (capMatch) result.capacity = `${capMatch[1]} ${capMatch[2].toUpperCase()}`;
                }

                // Finish type — improved to catch "28 pp", "TO 63", "CORK" (FIX 1)
                if (!result.finishType) {
                    const finish = extractFinishType(next);
                    if (finish) result.finishType = finish;
                }

                // Number of layers: last number on the line
                const allNums = next.match(/\d+/g);
                if (allNums && allNums.length > 0 && !result.numberOfLayers) {
                    result.numberOfLayers = parseInt(allNums[allNums.length - 1]);
                }
            }
        }

        // ── PIECES PER PALLET ─────────────────────────────────────────────────
        if (
            (fuzzyIncludes(line, 'PIECE') || fuzzyIncludes(line, 'PCS')) &&
            !result.piecesPerPallet
        ) {
            const next = nextLine(i);
            const num = extractNumber(next);
            if (num !== undefined) result.piecesPerPallet = num;
        }

        // ── NUMBER OF PALLET ──────────────────────────────────────────────────
        if (
            fuzzyIncludes(line, 'PALLET') &&
            !fuzzyIncludes(line, 'PIECE') &&
            !fuzzyIncludes(line, 'PCS') &&
            !result.numberOfPallet
        ) {
            const next = nextLine(i);
            const num = extractNumber(next);
            if (num !== undefined) result.numberOfPallet = num;
        }
    }

    return result;
}