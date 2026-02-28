import React, { useState } from 'react';
import { Typography, Space, App } from 'antd';
import { useAuth } from '../../auth/AuthContext';
import NumericKeypad from '../../components/Auth/NumericKeypad';

const { Title, Text } = Typography;

const PinSetupPage: React.FC = () => {
    const { setupPin } = useAuth();
    const { message } = App.useApp();
    const [step, setStep] = useState<1 | 2>(1);
    const [pin, setPin] = useState<string[]>([]);
    const [firstPin, setFirstPin] = useState<string[]>([]);

    const handleNumber = (num: string) => {
        if (pin.length >= 4) return;
        const newPin = [...pin, num];
        setPin(newPin);

        if (newPin.length === 4) {
            if (step === 1) {
                // Move to confirmation
                setTimeout(() => {
                    setFirstPin(newPin);
                    setPin([]);
                    setStep(2);
                }, 300);
            } else {
                // Verify match
                if (newPin.join('') === firstPin.join('')) {
                    setupPin(newPin.join(''));
                    message.success('تم إعداد الرمز بنجاح');
                } else {
                    message.error('الرموز غير متطابقة، حاول مرة أخرى');
                    setPin([]);
                    setFirstPin([]);
                    setStep(1);
                }
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const dots = [0, 1, 2, 3];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <Space direction="vertical" size="large" className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
                <div className="mb-4">
                    <Title level={2} style={{ fontFamily: 'Cairo, sans-serif', color: 'var(--primary-color)', margin: 0 }}>
                        {step === 1 ? 'إنشاء رمز الدخول' : 'تأكيد رمز الدخول'}
                    </Title>
                    <Text className="text-gray-500 mt-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontSize: '1.1rem' }}>
                        {step === 1 ? 'الرجاء إدخال رمز مكون من 4 أرقام' : 'الرجاء إدخال الرمز مرة أخرى للتأكيد'}
                    </Text>
                </div>

                <div className="flex justify-center gap-6 my-10">
                    {dots.map((d) => (
                        <div
                            key={d}
                            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 transform ${pin.length > d ? 'scale-110 shadow-lg' : 'scale-100'
                                }`}
                            style={{
                                borderColor: 'var(--primary-color)',
                                backgroundColor: pin.length > d ? '#000000' : 'transparent'
                            }}
                        />
                    ))}
                </div>

                <NumericKeypad onNumber={handleNumber} onDelete={handleDelete} />
            </Space>
        </div>
    );
};

export default PinSetupPage;
