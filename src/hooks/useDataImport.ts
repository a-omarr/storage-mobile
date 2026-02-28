import { useState } from 'react';
import { message } from 'antd';
import { Capacitor } from '@capacitor/core';
import { getDB, saveWebStore } from '../db/database';
import type { Product } from '../types/product';

export const useDataImport = (onImportComplete?: () => void) => {
    const [isImporting, setIsImporting] = useState(false);

    /** Triggers the browser file picker or native file input */
    const importData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';

        input.onchange = async (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
                setIsImporting(true);

                let jsonString = '';

                if (Capacitor.isNativePlatform()) {
                    // Though input type=file on native might yield a Blob, 
                    // reading it usually works via FileReader the same way as web
                    jsonString = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target?.result as string);
                        reader.onerror = (error) => reject(error);
                        reader.readAsText(file);
                    });
                } else {
                    jsonString = await file.text();
                }

                const parsed = JSON.parse(jsonString);

                if (!parsed.data || !parsed.data.products) {
                    throw new Error('ملف النسخة الاحتياطية غير صالح أو تالف.');
                }

                const products: Product[] = parsed.data.products;
                const db = await getDB();

                // Begin a transaction to wipe and rewrite
                await db.run('BEGIN TRANSACTION;');
                await db.run('DELETE FROM products;');

                for (const p of products) {
                    await db.run(
                        `INSERT INTO products 
                         (id, sections, type, capacity, itemNo, batchNumber, color, finishType, 
                          qtyPerLayer, numberOfLayers, piecesPerPallet, numberOfPallet, dateOfProduction, createdAt)
                         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                        [
                            p.id,
                            JSON.stringify(p.sections),
                            p.type,
                            p.capacity,
                            p.itemNo,
                            p.batchNumber,
                            p.color,
                            p.finishType,
                            p.qtyPerLayer,
                            p.numberOfLayers,
                            p.piecesPerPallet,
                            p.numberOfPallet,
                            p.dateOfProduction,
                            p.createdAt,
                        ]
                    );
                }

                await db.run('COMMIT;');
                await saveWebStore();

                message.success('تم استعادة البيانات بنجاح!');
                if (onImportComplete) {
                    onImportComplete();
                }

            } catch (error: any) {
                console.error('Import Error:', error);

                try {
                    const db = await getDB();
                    await db.run('ROLLBACK;'); // rollback if we failed mid-transaction
                } catch (e) { }

                message.error('فشل في استعادة البيانات: ' + (error.message || 'تأكد من اختيار ملف صحيح'));
            } finally {
                setIsImporting(false);
            }
        };

        input.click();
    };

    return { importData, isImporting };
};
