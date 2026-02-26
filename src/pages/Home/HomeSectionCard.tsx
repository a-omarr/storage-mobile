import React from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface Props {
    sectionKey: string;
    label: string;
    color: string;
    gradient: string;
    count: number;
}

const HomeSectionCard: React.FC<Props> = ({ sectionKey, label, color, gradient, count }) => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-white rounded-[12px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-200 border-2 border-transparent hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:border-[#1677ff] hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => navigate(`/section/${sectionKey}`)}
        >
            <div
                className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white font-extrabold text-lg mb-2.5 font-['Cairo',sans-serif]"
                style={{ background: gradient }}
            >
                {sectionKey === 'THE_SIXTH' ? 'س' : sectionKey === 'EYES' ? 'ع' : sectionKey}
            </div>
            <Text style={{
                display: 'block',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                fontSize: 15,
                marginBottom: 2,
                color: 'var(--color-text)',
            }}>
                {label}
            </Text>
            <Text style={{ color, fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}>
                {count} منتج
            </Text>
        </div>
    );
};

export default HomeSectionCard;
