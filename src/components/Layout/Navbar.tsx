import React from 'react';
import { Layout, Button, Typography } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Header
            style={{
                position: 'fixed',
                top: 0,
                zIndex: 1000,
                width: '100%',
                background: 'linear-gradient(135deg, #1677ff, #0958d9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                boxShadow: '0 2px 12px rgba(22,119,255,0.35)',
                height: 64,
            }}
        >
            {/* Brand */}
            <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <div
                    style={{
                        width: 36,
                        height: 36,
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 18,
                        color: 'white',
                    }}
                >
                    م
                </div>
                <div>
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: 16,
                            display: 'block',
                            lineHeight: 1.2,
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    >
                        إدارة المخزن
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.75)',
                            fontSize: 11,
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    >
                        شركة الحديثة للزجاج
                    </Text>
                </div>
            </div>

            {/* Search icon */}
            <Button
                type="text"
                icon={<BarsOutlined style={{ fontSize: 22 }} />}
                style={{ color: 'white' }}
                onClick={() => navigate('/search')}
                title="البحث"
            />
        </Header>
    );
};

export default Navbar;
