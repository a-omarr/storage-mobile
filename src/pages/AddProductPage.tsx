import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, message } from 'antd';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { ProductFormData, SectionKey } from '../types/product';
import ProductForm from '../components/Product/ProductForm';
import { SECTION_MAP } from '../constants/sections';

const { Title } = Typography;

const AddProductPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    const defaultSection = searchParams.get('section') as SectionKey | null;
    const sectionConfig = defaultSection ? SECTION_MAP[defaultSection] : null;

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

    return (
        <div>
            {/* Page Header */}
            <div
                style={{
                    background: sectionConfig?.gradient || 'linear-gradient(135deg, #1677ff, #0958d9)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 24px',
                    marginBottom: 20,
                }}
            >
                <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                    ➕ إضافة منتج جديد{sectionConfig ? ` — ${sectionConfig.label}` : ''}
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
                    defaultSection={defaultSection || undefined}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default AddProductPage;
