import React, { useState } from 'react';
import { Typography, Space, App } from 'antd';
import { useAuth } from '../../auth/AuthContext';
import NumericKeypad from '../../components/Auth/NumericKeypad';

const { Title, Text } = Typography;

const PinEntryPage: React.FC = () => {
    const { unlock } = useAuth();
    const { message } = App.useApp();
    const [pin, setPin] = useState<string[]>([]);
    const [isError, setIsError] = useState(false);

    const handleNumber = async (num: string) => {
        if (pin.length >= 4) return;
        const newPin = [...pin, num];
        setPin(newPin);

        if (newPin.length === 4) {
            const success = await unlock(newPin.join(''));
            if (!success) {
                setIsError(true);
                message.error('رمز خاطئ، حاول مرة أخرى');
                setTimeout(() => {
                    setPin([]);
                    setIsError(false);
                }, 500);
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
                        أهلاً بك
                    </Title>
                    <Text className="text-gray-500 mt-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontSize: '1.1rem' }}>
                        الرجاء إدخال رمز الدخول للمتابعة
                    </Text>
                </div>

                <div className={`flex justify-center gap-6 my-10 ${isError ? 'animate-shake' : ''}`}>
                    {dots.map((d) => (
                        <div
                            key={d}
                            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 transform ${pin.length > d ? 'scale-110 shadow-lg' : 'scale-100'
                                }`}
                            style={{
                                borderColor: isError ? '#ff4d4f' : 'var(--primary-color)',
                                backgroundColor: pin.length > d ? (isError ? '#ff4d4f' : '#000000') : 'transparent'
                            }}
                        />
                    ))}
                </div>

                <NumericKeypad onNumber={handleNumber} onDelete={handleDelete} />
            </Space>
        </div>
    );
};

export default PinEntryPage;
