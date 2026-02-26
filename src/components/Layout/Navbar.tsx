import React from 'react';
import { Layout, Button, Typography } from 'antd';
import { FiSearch } from 'react-icons/fi';
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
            <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1, minWidth: 0, paddingRight: 8 }}
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
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: 16,
                            display: 'block',
                            lineHeight: 1.2,
                            fontFamily: 'Cairo, sans-serif',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        إدارة المخزن
                    </Text>

                </div>
            </div>

            {/* Search icon */}
            <Button
                type="text"
                icon={<FiSearch style={{ fontSize: 22 }} />}
                style={{ color: 'white' }}
                onClick={() => navigate('/search')}
                title="البحث"
            />
        </Header >
    );
};

export default Navbar;
