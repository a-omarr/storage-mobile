import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, message, Popconfirm } from 'antd';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { ProductFormData, SectionKey } from '../types/product';
import ProductForm from '../components/Product/ProductForm';
import { SECTION_MAP } from '../constants/sections';
import { FiPlusCircle, FiX } from 'react-icons/fi';

const { Title } = Typography;

const AddProductPage: React.FC = () => {
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
                className="rounded-[12px] px-6 py-4 mb-5 flex items-center justify-between"
                style={{ background: sectionConfig?.gradient || 'linear-gradient(135deg, #1677ff, #0958d9)' }}
            >
                <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                    <FiPlusCircle className="inline ml-2" />
                    إضافة منتج جديد{sectionConfig ? ` — ${sectionConfig.label}` : ''}
                </Title>

                <Popconfirm
                    title="إلغاء الإضافة"
                    description="هل أنت متأكد من إلغاء إضافة المنتج؟ لن يتم حفظ أي بيانات."
                    onConfirm={handleCancel}
                    okText="نعم، إلغاء"
                    cancelText="لا، تراجع"
                    okButtonProps={{ danger: true }}
                    placement="bottomLeft"
                >
                    <button
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center text-white cursor-pointer border-0 shrink-0"
                        title="إلغاء"
                    >
                        <FiX size={18} />
                    </button>
                </Popconfirm>
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
