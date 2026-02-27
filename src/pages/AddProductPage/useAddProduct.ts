import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { message } from 'antd';
import { db } from '../../firebase/config';
import type { ProductFormData, SectionKey } from '../../types/product';
import { SECTION_MAP } from '../../constants/sections';

export const useAddProduct = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    const defaultSection = searchParams.get('section') as SectionKey | null;
    const sectionConfig = defaultSection ? SECTION_MAP[defaultSection] : null;

    const handleCancel = () => {
        if (defaultSection) {
            navigate(`/section/${defaultSection}`);
        } else {
            navigate('/');
        }
    };

    const handleSubmit = async (data: ProductFormData) => {
        if (!data.dateOfProduction) {
            message.error('يرجى إدخال تاريخ الإنتاج');
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, 'products'), {
                ...data,
                dateOfProduction: Timestamp.fromDate(data.dateOfProduction),
                createdAt: Timestamp.now(),
            });
            navigator.vibrate?.(80);
            message.success('تم إضافة المنتج بنجاح');
            if (defaultSection) {
                navigate(`/section/${defaultSection}`);
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Add product error:', err);
            message.error('حدث خطأ أثناء الحفظ. تحقق من اتصالك بالإنترنت.');
        } finally {
            setLoading(false);
        }
    };

    return { loading, defaultSection, sectionConfig, handleCancel, handleSubmit };
};
