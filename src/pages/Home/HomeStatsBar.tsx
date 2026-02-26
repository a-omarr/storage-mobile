import React from 'react';
import { Typography } from 'antd';
import { FiPackage } from 'react-icons/fi';

const { Title, Text } = Typography;

interface Props {
    total: number;
}

const HomeStatsBar: React.FC<Props> = ({ total }) => (
    <div className="bg-gradient-to-br from-[#1677ff] to-[#0958d9] text-white rounded-[12px] px-5 py-4 mb-5">
        <div className="flex justify-between items-center">
            <div>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Cairo, sans-serif', fontSize: 13 }}>
                    إجمالي المنتجات
                </Text>
                <Title level={2} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
                    {total}
                </Title>
            </div>
            <FiPackage className="text-[40px] opacity-30" />
        </div>
    </div>
);

export default HomeStatsBar;
