import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { message } from 'antd';

export const useProductDelete = () => {
    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            navigator.vibrate?.(60);
            message.success('تم حذف المنتج بنجاح');
        } catch (err) {
            navigator.vibrate?.([100, 50, 100]);
            console.error('Delete error:', err);
            message.error('فشل في حذف المنتج');
        }
    };

    return { handleDelete };
};
