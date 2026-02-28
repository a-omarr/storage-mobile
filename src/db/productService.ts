import { getDB, saveWebStore } from './database';
import type { Product, ProductFormData, SectionKey } from '../types/product';

/** Generate a UUID-style ID */
function generateId(): string {
    return crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Map a raw SQLite row to a Product object */
function rowToProduct(row: any[]): Product {
    // Column order must match the SELECT in queries below
    return {
        id: row[0] as string,
        sections: JSON.parse(row[1] as string) as SectionKey[],
        type: row[2] as string,
        capacity: row[3] as string,
        itemNo: row[4] as string,
        batchNumber: row[5] as string,
        color: row[6] as string,
        finishType: row[7] as string,
        qtyPerLayer: row[8] as number,
        numberOfLayers: row[9] as number,
        piecesPerPallet: row[10] as number,
        numberOfPallet: row[11] as number,
        dateOfProduction: row[12] as string,
        createdAt: row[13] as string,
    };
}

const SELECT_ALL_COLS = `
  id, sections, type, capacity, itemNo, batchNumber, color, finishType,
  qtyPerLayer, numberOfLayers, piecesPerPallet, numberOfPallet,
  dateOfProduction, createdAt
`;

// ─────────────────────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all products, ordered by dateOfProduction ascending */
export async function getAllProducts(): Promise<Product[]> {
    const db = await getDB();
    const result = await db.query(
        `SELECT ${SELECT_ALL_COLS} FROM products ORDER BY dateOfProduction ASC;`
    );
    if (!result.values || result.values.length === 0) return [];
    return result.values.map(rowToProduct);
}

/** Fetch a single product by its ID */
export async function getProductById(id: string): Promise<Product | null> {
    const db = await getDB();
    const result = await db.query(
        `SELECT ${SELECT_ALL_COLS} FROM products WHERE id = ?;`,
        [id]
    );
    if (!result.values || result.values.length === 0) return null;
    return rowToProduct(result.values[0]);
}

/**
 * Fetch all products that contain the given section.
 * Since sections is a JSON array string like '["A","B"]', we use a
 * LIKE filter — this is efficient enough for small/medium datasets.
 */
export async function getProductsBySection(section: SectionKey): Promise<Product[]> {
    const db = await getDB();
    const result = await db.query(
        `SELECT ${SELECT_ALL_COLS} FROM products
         WHERE sections LIKE ?
         ORDER BY dateOfProduction ASC;`,
        [`%"${section}"%`]
    );
    if (!result.values || result.values.length === 0) return [];
    return result.values.map(rowToProduct);
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────────────────────────────────────

/** Add a new product. Returns the generated ID. */
export async function addProduct(data: ProductFormData): Promise<string> {
    if (!data.dateOfProduction) throw new Error('dateOfProduction is required');

    const db = await getDB();
    const id = generateId();
    const now = new Date().toISOString();
    const dateStr = data.dateOfProduction.toISOString();
    const sectionsJson = JSON.stringify(data.sections ?? []);

    await db.run(
        `INSERT INTO products
         (id, sections, type, capacity, itemNo, batchNumber, color, finishType,
          qtyPerLayer, numberOfLayers, piecesPerPallet, numberOfPallet, dateOfProduction, createdAt)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
        [
            id,
            sectionsJson,
            data.type,
            data.capacity,
            data.itemNo,
            data.batchNumber,
            data.color,
            data.finishType,
            data.qtyPerLayer,
            data.numberOfLayers,
            data.piecesPerPallet,
            data.numberOfPallet,
            dateStr,
            now,
        ]
    );
    await saveWebStore();
    return id;
}

/** Update an existing product's fields */
export async function updateProduct(
    id: string,
    data: ProductFormData
): Promise<void> {
    if (!data.dateOfProduction) throw new Error('dateOfProduction is required');

    const db = await getDB();
    const dateStr = data.dateOfProduction.toISOString();
    const sectionsJson = JSON.stringify(data.sections ?? []);

    await db.run(
        `UPDATE products SET
           sections = ?, type = ?, capacity = ?, itemNo = ?, batchNumber = ?,
           color = ?, finishType = ?, qtyPerLayer = ?, numberOfLayers = ?,
           piecesPerPallet = ?, numberOfPallet = ?, dateOfProduction = ?
         WHERE id = ?;`,
        [
            sectionsJson,
            data.type,
            data.capacity,
            data.itemNo,
            data.batchNumber,
            data.color,
            data.finishType,
            data.qtyPerLayer,
            data.numberOfLayers,
            data.piecesPerPallet,
            data.numberOfPallet,
            dateStr,
            id,
        ]
    );
    await saveWebStore();
}

/** Delete a product entirely */
export async function deleteProduct(id: string): Promise<void> {
    const db = await getDB();
    await db.run(`DELETE FROM products WHERE id = ?;`, [id]);
    await saveWebStore();
}

/**
 * Remove a specific section from a product's sections array.
 * If the product has no sections left after removal, the product is deleted.
 */
export async function removeProductSection(
    id: string,
    section: SectionKey
): Promise<void> {
    const product = await getProductById(id);
    if (!product) return;

    const newSections = product.sections.filter((s) => s !== section);
    const db = await getDB();

    if (newSections.length === 0) {
        await db.run(`DELETE FROM products WHERE id = ?;`, [id]);
    } else {
        await db.run(
            `UPDATE products SET sections = ? WHERE id = ?;`,
            [JSON.stringify(newSections), id]
        );
    }
    await saveWebStore();
}
