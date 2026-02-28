import { useState } from 'react';
import { message } from 'antd';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { getAllProducts } from '../db/productService';

export const useDataExport = () => {
    const [isExporting, setIsExporting] = useState(false);

    const exportData = async () => {
        try {
            setIsExporting(true);
            const products = await getAllProducts();

            const exportPayload = {
                version: 1,
                exportedAt: new Date().toISOString(),
                data: {
                    products
                }
            };

            const jsonString = JSON.stringify(exportPayload, null, 2);
            const fileName = `storage_backup_${new Date().toISOString().split('T')[0]}.json`;

            if (Capacitor.isNativePlatform()) {
                // Write to local device cache/documents so we can share it
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: jsonString,
                    directory: Directory.Cache,
                    encoding: Encoding.UTF8
                });

                // Trigger native share sheet
                await Share.share({
                    title: 'نسخة احتياطية للمخزن',
                    text: 'بيانات تطبيق إدارة المخزن',
                    url: result.uri,
                    dialogTitle: 'مشاركة أو حفظ النسخة الاحتياطية',
                });
            } else {
                // Browser fallback: download file
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                message.success('تم تحميل النسخة الاحتياطية بنجاح');
            }
        } catch (error: any) {
            console.error('Export Error:', error);
            message.error('فشل في تصدير البيانات: ' + (error.message || 'خطأ غير معروف'));
        } finally {
            setIsExporting(false);
        }
    };

    return { exportData, isExporting };
};
