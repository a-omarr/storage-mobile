import { message } from 'antd';
import { deleteProduct, removeProductSection, getProductById } from '../../../db/productService';
import type { SectionKey } from '../../../types/product';

export const useProductDelete = () => {
    const handleDelete = async (
        idOrCompound: string,
        options?: {
            currentSection?: SectionKey;
            onRefresh?: () => void;
            hideMessage?: boolean;
        }
    ) => {
        try {
            console.log('--- START DELETE ---');
            const [productId, idSegmentSection] = idOrCompound.split('::');
            const activeSection = options?.currentSection || (idSegmentSection as SectionKey);

            console.log('[handleDelete] Input:', idOrCompound);
            console.log('[handleDelete] Active Section Context:', activeSection);

            if (!activeSection) {
                console.log('[handleDelete] ACTION: FULL DELETE (no section context found)');
                await deleteProduct(productId);
            } else {
                const product = await getProductById(productId);
                if (!product) {
                    console.error('[handleDelete] ERROR: Product not found in DB!');
                } else {
                    console.log('[handleDelete] DB DATA FOR ID:', {
                        id: product.id,
                        type: product.type,
                        sections: product.sections
                    });

                    if (product.sections.length === 1) {
                        console.log('[handleDelete] ACTION: FULL DELETE (only 1 section in DB array)');
                        await deleteProduct(productId);
                    } else if (!product.sections.includes(activeSection)) {
                        console.warn('[handleDelete] WARNING: target section not found in product.sections. Falling back to full delete.');
                        await deleteProduct(productId);
                    } else {
                        console.log('[handleDelete] ACTION: REMOVE SECTION ONLY:', activeSection);
                        await removeProductSection(productId, activeSection);
                    }
                }
            }

            navigator.vibrate?.(60);
            if (!options?.hideMessage) message.success('تم الحذف بنجاح');
            options?.onRefresh?.();
            console.log('--- END DELETE SUCCESS ---');
            return true;
        } catch (err) {
            navigator.vibrate?.([100, 50, 100]);
            console.error('[handleDelete] EXCEPTION:', err);
            if (!options?.hideMessage) message.error('فشل في الحذف');
            return false;
        }
    };

    const handleBulkDelete = async (
        productIds: string[],
        options?: {
            currentSection?: SectionKey;
            onRefresh?: () => void;
        }
    ) => {
        if (productIds.length === 0) return true;

        try {
            console.log('--- START BULK DELETE ---');
            console.log('[handleBulkDelete] IDs:', productIds);
            console.log('[handleBulkDelete] currentSection:', options?.currentSection);

            // Sequential for-of to avoid race conditions on the same product record
            for (const idOrCompound of productIds) {
                const [id, idSegmentSection] = idOrCompound.split('::');
                const activeSection = options?.currentSection || (idSegmentSection as SectionKey);

                if (!activeSection) {
                    console.log(`[handleBulkDelete] ID ${id}: FULL DELETE (no context)`);
                    await deleteProduct(id);
                } else {
                    const product = await getProductById(id);
                    if (product) {
                        console.log(`[handleBulkDelete] ID ${id} context ${activeSection}, DB sections:`, product.sections);
                        if (product.sections.length === 1) {
                            console.log(`[handleBulkDelete] ID ${id}: FULL DELETE (1 section)`);
                            await deleteProduct(id);
                        } else {
                            console.log(`[handleBulkDelete] ID ${id}: REMOVE SECTION ONLY (${activeSection})`);
                            await removeProductSection(id, activeSection);
                        }
                    }
                }
            }

            navigator.vibrate?.([60, 60]);
            message.success(`تم حذف ${productIds.length} عناصر بنجاح`);
            options?.onRefresh?.();
            console.log('--- END BULK DELETE SUCCESS ---');
            return true;
        } catch (err) {
            console.error('[handleBulkDelete] EXCEPTION:', err);
            message.error('فشل في حذف بعض أو كل العناصر المحددة');
            return false;
        }
    };

    return { handleDelete, handleBulkDelete };
};

