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
                className="flex items-center gap-[10px] cursor-pointer flex-1 min-w-0 pr-2"
                onClick={() => navigate('/')}
            >
                <div className="w-9 h-9 bg-white/20 rounded-[10px] flex items-center justify-center font-extrabold text-lg text-white shrink-0">
                    م
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
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
        </Header>
    );
};

export default Navbar;
