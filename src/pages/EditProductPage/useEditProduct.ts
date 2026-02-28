import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { message } from 'antd';
import { db } from '../../firebase/config';
import type { Product, ProductFormData } from '../../types/product';
import { SECTION_MAP } from '../../constants/sections';

export const useEditProduct = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, 'products', id));
                if (snap.exists()) {
                    setProduct({ id: snap.id, ...snap.data() } as Product);
                } else {
                    setError('المنتج غير موجود');
                }
            } catch (err) {
                setError('خطأ في تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleSubmit = async (data: ProductFormData) => {
        if (!id || !data.dateOfProduction) {
            message.error('يرجى إدخال تاريخ الإنتاج');
            return;
        }
        setSaving(true);
        try {
            await updateDoc(doc(db, 'products', id), {
                ...data,
                dateOfProduction: Timestamp.fromDate(data.dateOfProduction),
            });
            navigator.vibrate?.(80);
            message.success('تم حفظ التعديلات بنجاح');
            const defaultSection = data.sections && data.sections.length > 0 ? data.sections[0] : null;
            if (defaultSection) {
                navigate(`/section/${defaultSection}`);
            } else {
                navigate(`/`);
            }
        } catch (err) {
            console.error('Edit error:', err);
            message.error('حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const sectionConfig = product && product.sections?.length ? SECTION_MAP[product.sections[0] as keyof typeof SECTION_MAP] : null;

    const handleCancel = () => {
        navigate(-1);
    };

    const initialValues: Partial<ProductFormData> | undefined = product
        ? { ...product, dateOfProduction: product.dateOfProduction?.toDate() ?? null }
        : undefined;

    return { product, loading, saving, error, sectionConfig, initialValues, handleSubmit, handleCancel };
};
