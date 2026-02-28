import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, GoogleOutlined } from '@ant-design/icons';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../firebase/config';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from state, or default to home
    const from = location.state?.from?.pathname || '/';

    const checkAdminAndNavigate = async (uid: string) => {
        const adminDocRef = doc(db, 'admins', uid);
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
            message.success('تم تسجيل الدخول بنجاح');
            navigate(from, { replace: true });
        } else {
            // Not an admin - sign them out immediately
            await signOut(auth);
            message.error('عذراً، هذا الحساب غير مصرح له بالدخول. يرجى التواصل مع المسؤول.');
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            await checkAdminAndNavigate(userCredential.user.uid);
        } catch (error: any) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            await checkAdminAndNavigate(userCredential.user.uid);
        } catch (error: any) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (error: any) => {
        console.error('Auth error:', error);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        } else if (error.code === 'auth/too-many-requests') {
            message.error('تم حظر الحساب مؤقتاً بسبب محاولات كثيرة خاطئة. يرجى المحاولة لاحقاً.');
        } else if (error.code === 'auth/popup-closed-by-user') {
            message.info('تم إغلاق نافذة تسجيل الدخول');
        } else {
            message.error('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-500 to-indigo-600 transform -skew-y-6 -translate-y-20 z-0 opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-[100px] opacity-30 z-0"></div>

            <Card
                className="w-full max-w-md shadow-2xl rounded-2xl border-0 overflow-hidden z-10 bg-white/90 backdrop-blur-sm"
                styles={{ body: { padding: '40px 32px' } }}
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
                        <LoginOutlined className="text-white text-4xl -rotate-3" />
                    </div>
                    <Title level={2} className="!mb-1 !text-gray-800">
                        مرحباً بك
                    </Title>
                    <Text className="text-gray-500 text-base">
                        قم بتسجيل الدخول للوصول إلى النظام
                    </Text>
                </div>

                <Form
                    name="login_form"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    size="large"
                    requiredMark={false}
                    validateTrigger="onSubmit"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'يرجى إدخال البريد الإلكتروني!' },
                            { type: 'email', message: 'يرجى إدخال بريد إلكتروني صحيح!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="البريد الإلكتروني"
                            className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 px-4 py-3"
                            dir="ltr"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'يرجى إدخال كلمة المرور!' }]}
                        className="mb-8"
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="كلمة المرور"
                            className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 px-4 py-3"
                            dir="ltr"
                        />
                    </Form.Item>

                    <Form.Item className="mb-4">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            تسجيل الدخول
                        </Button>
                    </Form.Item>

                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <span className="relative px-4 bg-white text-gray-400 text-sm">أو</span>
                    </div>

                    <Button
                        icon={<GoogleOutlined />}
                        block
                        size="large"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="h-12 rounded-xl border-gray-200 hover:border-blue-400 hover:text-blue-500 font-medium transition-all"
                    >
                        تسجيل الدخول بواسطة Google
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
