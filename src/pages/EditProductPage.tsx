import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, Alert, message } from 'antd';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product, ProductFormData } from '../types/product';
import { SECTION_MAP } from '../constants/sections';
import ProductForm from '../components/Product/ProductForm';

const { Title } = Typography;

const EditProductPage: React.FC = () => {
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
            message.success('تم حفظ التعديلات بنجاح');
            navigate(`/section/${data.section}`);
        } catch (err) {
            console.error('Edit error:', err);
            message.error('حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const sectionConfig = product ? SECTION_MAP[product.section] : null;

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <Alert
                type="error"
                message={error || 'منتج غير موجود'}
                style={{ fontFamily: 'Cairo, sans-serif' }}
            />
        );
    }

    // Convert Timestamp to Date for the form's initial values
    const initialValues: Partial<ProductFormData> = {
        ...product,
        dateOfProduction: product.dateOfProduction?.toDate() ?? null,
    };

    return (
        <div>
            <div
                className="rounded-[12px] px-6 py-4 mb-5"
                style={{ background: sectionConfig?.gradient || 'linear-gradient(135deg, #1677ff, #0958d9)' }}
            >
                <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                    ✏️ تعديل منتج — {product.type} {product.capacity}
                </Title>
            </div>

            <Card
                style={{
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    border: 'none',
                }}
                bodyStyle={{ padding: '24px' }}
            >
                <ProductForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    loading={saving}
                    isEdit
                />
            </Card>
        </div>
    );
};

export default EditProductPage;
