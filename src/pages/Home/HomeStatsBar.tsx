import React from 'react';
import { Typography, Button } from 'antd';
import { FiPackage, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface Props {
    total: number;
}

const HomeStatsBar: React.FC<Props> = ({ total }) => {
    const navigate = useNavigate();

    return (
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
                <div className="flex items-center gap-4">
                    <Button
                        type="default"
                        icon={<FiPlus />}
                        onClick={() => navigate('/add')}
                        size="large"
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderColor: 'transparent',
                            color: 'white',
                            fontFamily: 'Cairo, sans-serif',
                            boxShadow: 'none',
                        }}
                        className="hover:bg-white hover:text-blue-600 border-none transition-colors border-0 flex font-semibold"
                    >
                        إضافة منتج
                    </Button>
                    <FiPackage className="text-[40px] opacity-30 hidden sm:block" />
                </div>
            </div>
        </div>
    );
};

export default HomeStatsBar;
