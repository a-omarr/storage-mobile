import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { message } from 'antd';

export const useProductDelete = () => {
    const handleDelete = async (compoundId: string, hideMessage = false) => {
        try {
            const [id, sectionToRemove] = compoundId.split('::');

            if (sectionToRemove) {
                // Partial delete: remove section from array
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const currentSections = data.sections || [];
                    const newSections = currentSections.filter((s: string) => s !== sectionToRemove);

                    if (newSections.length === 0) {
                        // If no sections left, delete the entire document
                        await deleteDoc(docRef);
                    } else {
                        // Otherwise, update the document with the section removed
                        await updateDoc(docRef, { sections: newSections });
                    }
                }
            } else {
                // Full delete (fallback)
                await deleteDoc(doc(db, 'products', id));
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

            compoundIds.forEach(compoundId => {
                const [id, sectionToRemove] = compoundId.split('::');
                if (!operationsByDocId[id]) {
                    operationsByDocId[id] = [];
                }
                if (sectionToRemove) {
                    operationsByDocId[id].push(sectionToRemove);
                } else {
                    // Using a special token to signify "delete entire document"
                    operationsByDocId[id].push('__DELETE_ALL__');
                }
            });

            // Process each unique document sequentially or in parallel 
            // since they are now operating on different documents entirely.
            // Using Promise.all here is safe because the keys are unique docs.
            const promises = Object.entries(operationsByDocId).map(async ([id, sectionsToRemove]) => {
                const docRef = doc(db, 'products', id);

                if (sectionsToRemove.includes('__DELETE_ALL__')) {
                    await deleteDoc(docRef);
                    return;
                }

                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const currentSections = data.sections || [];

                    // Filter out ALL sections that were requested to be removed
                    const newSections = currentSections.filter(
                        (s: string) => !sectionsToRemove.includes(s)
                    );

                    if (newSections.length === 0) {
                        await deleteDoc(docRef);
                    } else {
                        await updateDoc(docRef, { sections: newSections });
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
