import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

export const useProductDelete = () => {
    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    return { handleDelete };
};
