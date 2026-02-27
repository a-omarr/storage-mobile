import React from 'react';
import { Empty, Button, Typography } from 'antd';
import { FiPackage, FiSearch, FiLayers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

interface Props {
    variant?: 'general' | 'search' | 'home';
    message?: string;
    description?: string;
    action?: {
        text: string;
        link: string;
    };
}

const EmptyIllustration: React.FC<Props> = ({ variant = 'general', message, description, action }) => {
    const navigate = useNavigate();

    const config = {
        general: {
            icon: <FiPackage size={64} style={{ color: '#bae7ff' }} />,
            title: message || 'لا توجد منتجات',
            desc: description || 'ابدأ بإضافة منتجاتك لتظهر هنا في جدول البيانات.',
            action: action || null
        },
        search: {
            icon: <FiSearch size={64} style={{ color: '#ffe7ba' }} />,
            title: message || 'لا توجد نتائج',
            desc: description || 'تأكد من كتابة الاسم أو رقم الصنف بشكل صحيح وحاول مرة أخرى.',
            action: null
        },
        home: {
            icon: <FiLayers size={64} style={{ color: '#d9f7be' }} />,
            title: message || 'المخزن فارغ حالياً',
            desc: description || 'يمكنك البدء بملء بيانات المخزون وتنظيم منتجاتك من هنا.',
            action: action || { text: 'إضافة منتج جديد', link: '/add' }
        }
    };

    const current = config[variant];

    return (
        <div className="py-12 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <Empty
                image={current.icon}
                imageStyle={{ height: 80, marginBottom: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                description={
                    <div className="flex flex-col items-center gap-2">
                        <Title level={4} style={{ margin: 0, color: '#1a2332', fontFamily: 'Cairo, sans-serif' }}>
                            {current.title}
                        </Title>
                        <Text style={{ color: '#6b7c93', fontSize: 14, maxWidth: 300, textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>
                            {current.desc}
                        </Text>
                    </div>
                }
            >
                {current.action && (
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate(current.action!.link)}
                        className="mt-4 bg-[#1677ff] rounded-lg h-11 px-8 font-bold"
                        style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                        {current.action.text}
                    </Button>
                )}
            </Empty>
        </div>
    );
};

export default EmptyIllustration;
