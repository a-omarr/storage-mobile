import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { addProduct } from '../../db/productService';
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
        // Determine inventory
        const isInventory1 = data.sections?.some(s => {
            const config = SECTION_MAP[s as keyof typeof SECTION_MAP];
            return config && config.inventory === 1;
        });

        if (isInventory1 && !data.dateOfProduction) {
            message.error('يرجى إدخال تاريخ الإنتاج');
            return;
        }
        setLoading(true);
        try {
            await addProduct(data);
            navigator.vibrate?.(80);
            message.success('تم إضافة المنتج بنجاح');
            if (defaultSection) {
                navigate(`/section/${defaultSection}`);
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Add product error:', err);
            message.error('حدث خطأ أثناء الحفظ.');
        } finally {
            setLoading(false);
        }
    };

    return { loading, defaultSection, sectionConfig, handleCancel, handleSubmit };
};

