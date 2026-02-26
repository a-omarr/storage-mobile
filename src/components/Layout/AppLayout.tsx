import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar.tsx';
import Sidebar from './Sidebar.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { SECTIONS } from '../../constants/sections';
import { FiHome } from 'react-icons/fi';

const { Content } = Layout;

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { section } = useParams<{ section?: string }>();

    return (
        <Layout style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <Navbar />
            <Layout hasSider style={{ marginTop: 64 }}>
                <div className="desktop-only">
                    <Sidebar />
                </div>
                <Content
                    style={{
                        padding: '0',
                        background: 'var(--color-bg)',
                        minHeight: 'calc(100vh - 64px)',
                    }}
                >
                    <div className="page-container page-enter">{children}</div>
                </Content>
            </Layout>

            {/* Mobile Bottom Navigation */}
            <div className="bottom-nav mobile-only">
                <button
                    className={`nav-item ${!section ? 'nav-item-active' : ''}`}
                    onClick={() => navigate('/')}
                >
                    <FiHome className="nav-icon" />
                    <span>الرئيسية</span>
                </button>
                {SECTIONS.slice(0, 4).map((s) => (
                    <button
                        key={s.key}
                        className={`nav-item ${section === s.key ? 'nav-item-active' : ''}`}
                        onClick={() => navigate(`/section/${s.key}`)}
                    >
                        <span className="nav-icon" style={{ fontWeight: 700 }}>{s.key}</span>
                        <span>{s.label.split(' ')[1] || s.label}</span>
                    </button>
                ))}
            </div>
        </Layout>
    );
};

export default AppLayout;
