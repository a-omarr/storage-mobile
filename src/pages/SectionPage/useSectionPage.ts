import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import type { Product, SectionKey } from '../../types/product';
import { SECTION_MAP } from '../../constants/sections';

export const useSectionPage = () => {
    const { section } = useParams<{ section: SectionKey }>();
    const navigate = useNavigate();
    const sectionKey = section as SectionKey;
    const sectionConfig = sectionKey ? SECTION_MAP[sectionKey] : null;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sectionKey) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'products'),
            where('section', '==', sectionKey),
            orderBy('dateOfProduction', 'asc')
        );

        const unsub = onSnapshot(
            q,
            (snap) => {
                const results = snap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Product[];
                setProducts(results);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [sectionKey]);

    const handleAddProduct = () => {
        navigate(`/add?section=${sectionKey}`);
    };

    return { sectionKey, sectionConfig, products, loading, error, handleAddProduct };
};
