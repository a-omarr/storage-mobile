import { getDB, saveWebStore } from './database';
import type { Product, ProductFormData, SectionKey } from '../types/product';

/** Generate a UUID-style ID */
function generateId(): string {
    return crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Map a raw SQLite row to a Product object */
function rowToProduct(row: any): Product {
    return {
        id: row.id as string,
        sections: JSON.parse(row.sections as string) as SectionKey[],
        inventory: row.inventory as 1 | 2,
        type: row.type as string,
        capacity: row.capacity as string || undefined,
        itemNo: row.itemNo as string || undefined,
        batchNumber: row.batchNumber as string || undefined,
        color: row.color as string || undefined,
        finishType: row.finishType as string || undefined,
        qtyPerLayer: row.qtyPerLayer as number || undefined,
        numberOfLayers: row.numberOfLayers as number || undefined,
        piecesPerPallet: row.piecesPerPallet as number || undefined,
        numberOfPallet: row.numberOfPallet as number || undefined,
        dateOfProduction: row.dateOfProduction as string || null,
        createdAt: row.createdAt as string,
    };
}

const SELECT_ALL_COLS = `
  id, sections, inventory, type, capacity, itemNo, batchNumber, color, finishType,
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
    const db = await getDB();
    const id = generateId();
    const now = new Date().toISOString();
    const dateStr = data.dateOfProduction ? data.dateOfProduction.toISOString() : null;
    const sectionsJson = JSON.stringify(data.sections ?? []);

    await db.run(
        `INSERT INTO products
         (id, sections, inventory, type, capacity, itemNo, batchNumber, color, finishType,
          qtyPerLayer, numberOfLayers, piecesPerPallet, numberOfPallet, dateOfProduction, createdAt)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
        [
            id,
            sectionsJson,
            data.inventory,
            data.type,
            data.capacity ?? null,
            data.itemNo ?? null,
            data.batchNumber ?? null,
            data.color ?? null,
            data.finishType ?? null,
            data.qtyPerLayer ?? null,
            data.numberOfLayers ?? null,
            data.piecesPerPallet ?? null,
            data.numberOfPallet ?? null,
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
    const db = await getDB();
    const dateStr = data.dateOfProduction ? data.dateOfProduction.toISOString() : null;
    const sectionsJson = JSON.stringify(data.sections ?? []);

    await db.run(
        `UPDATE products SET
           sections = ?, inventory = ?, type = ?, capacity = ?, itemNo = ?, batchNumber = ?,
           color = ?, finishType = ?, qtyPerLayer = ?, numberOfLayers = ?,
           piecesPerPallet = ?, numberOfPallet = ?, dateOfProduction = ?
         WHERE id = ?;`,
        [
            sectionsJson,
            data.inventory,
            data.type,
            data.capacity ?? null,
            data.itemNo ?? null,
            data.batchNumber ?? null,
            data.color ?? null,
            data.finishType ?? null,
            data.qtyPerLayer ?? null,
            data.numberOfLayers ?? null,
            data.piecesPerPallet ?? null,
            data.numberOfPallet ?? null,
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
