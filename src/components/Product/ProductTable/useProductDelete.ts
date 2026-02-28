import { message } from 'antd';
import { deleteProduct, removeProductSection, getProductById, updateProduct } from '../../../db/productService';
import type { SectionKey } from '../../../types/product';

export const useProductDelete = () => {
    const handleDelete = async (compoundId: string, hideMessage = false) => {
        try {
            const [id, sectionToRemove] = compoundId.split('::');

            if (sectionToRemove) {
                await removeProductSection(id, sectionToRemove as SectionKey);
            } else {
                await deleteProduct(id);
            }

            navigator.vibrate?.(60);
            if (!hideMessage) message.success('تم الحذف بنجاح');
            return true;
        } catch (err) {
            navigator.vibrate?.([100, 50, 100]);
            console.error('Delete error:', err);
            if (!hideMessage) message.error('فشل في الحذف');
            return false;
        }
    };

    const handleBulkDelete = async (compoundIds: string[]) => {
        if (compoundIds.length === 0) return true;

        try {
            // Group operations by true document ID
            const operationsByDocId: Record<string, string[]> = {};

            compoundIds.forEach((compoundId) => {
                const [id, sectionToRemove] = compoundId.split('::');
                if (!operationsByDocId[id]) {
                    operationsByDocId[id] = [];
                }
                if (sectionToRemove) {
                    operationsByDocId[id].push(sectionToRemove);
                } else {
                    operationsByDocId[id].push('__DELETE_ALL__');
                }
            });

            const promises = Object.entries(operationsByDocId).map(async ([id, sectionsToRemove]) => {
                if (sectionsToRemove.includes('__DELETE_ALL__')) {
                    await deleteProduct(id);
                    return;
                }

                const product = await getProductById(id);
                if (product) {
                    const newSections = product.sections.filter(
                        (s) => !sectionsToRemove.includes(s)
                    );

                    if (newSections.length === 0) {
                        await deleteProduct(id);
                    } else {
                        await updateProduct(id, {
                            ...product,
                            sections: newSections,
                            dateOfProduction: product.dateOfProduction ? new Date(product.dateOfProduction) : null,
                        });
                    }
                }
            });

            await Promise.all(promises);
            navigator.vibrate?.([60, 60]);
            message.success(`تم حذف ${compoundIds.length} عناصر بنجاح`);
            return true;
        } catch (err) {
            console.error('Bulk delete error:', err);
            message.error('فشل في حذف بعض أو كل العناصر المحددة');
            return false;
        }
    };

    return { handleDelete, handleBulkDelete };
};

