import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { getProductById, updateProduct, updateProductSectionsOnly, addProduct } from '../../db/productService';
import type { Product, ProductFormData, SectionKey } from '../../types/product';
import { SECTION_MAP } from '../../constants/sections';

export const useEditProduct = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Read the originating section from the query string (e.g. ?section=A)
    const searchParams = new URLSearchParams(location.search);
    const originSection = (searchParams.get('section') as SectionKey | null);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        getProductById(id)
            .then((p) => {
                if (!cancelled) {
                    if (p) setProduct(p);
                    else setError('المنتج غير موجود');
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError('خطأ في تحميل البيانات');
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, [id]);

    const handleSubmit = async (data: ProductFormData) => {
        if (!id || !product) return;

        setSaving(true);
        try {
            // Sections for this edited copy - the originating section (locked in UI)
            const editedSections: SectionKey[] = originSection
                ? [originSection]
                : product.sections;

            // All other sections the product belongs to (should remain untouched)
            const remainingSections: SectionKey[] = originSection
                ? product.sections.filter(s => s !== originSection)
                : [];

            if (remainingSections.length > 0) {
                // ── FORK-ON-EDIT ──────────────────────────────────────────────
                // The product belongs to other sections too. We must NOT touch
                // those - so we split:
                //  1. Strip the edited section from the original record
                //     (other sections keep the old data untouched)
                await updateProductSectionsOnly(id, remainingSections);

                //  2. Create a brand-new independent record for the edited section
                //     with the updated data
                await addProduct({
                    ...data,
                    sections: editedSections,
                    inventory: product.inventory,
                });
            } else {
                // Product only belongs to this one section - plain update in-place
                await updateProduct(id, {
                    ...data,
                    sections: editedSections,
                    inventory: product.inventory,
                });
            }

            navigator.vibrate?.(80);
            message.success('تم حفظ التعديلات بنجاح');

            const redirectSection = originSection ?? editedSections[0] ?? null;
            navigate(redirectSection ? `/section/${redirectSection}` : '/');
        } catch (err) {
            console.error('Edit error:', err);
            message.error('حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const sectionConfig = originSection
        ? SECTION_MAP[originSection as keyof typeof SECTION_MAP]
        : (product?.sections?.length
            ? SECTION_MAP[product.sections[0] as keyof typeof SECTION_MAP]
            : null);

    const handleCancel = () => {
        navigate(-1);
    };

    // In the form: only show the originating section (locked/disabled)
    const editSections: SectionKey[] = originSection
        ? [originSection]
        : (product?.sections ?? []);

    const initialValues: Partial<ProductFormData> | undefined = product
        ? {
            ...product,
            dateOfProduction: product.dateOfProduction ? new Date(product.dateOfProduction) : null,
            sections: editSections,
        }
        : undefined;

    return {
        product,
        loading,
        saving,
        error,
        sectionConfig,
        initialValues,
        handleSubmit,
        handleCancel,
        inventory: product?.inventory,
    };
};
