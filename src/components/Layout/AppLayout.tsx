import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar.tsx';
import Sidebar from './Sidebar.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { SECTIONS } from '../../constants/sections';

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
                    className="pb-20 md:pb-0"   // bottom padding on mobile only
                >
                    <div className="page-container page-enter">{children}</div>
                </Content>
            </Layout>

            {/* Mobile Bottom Navigation - Full-width fixed dock */}
            <div className="bottom-nav mobile-only fixed bottom-0 left-0 right-0 z-50 flex justify-around overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SECTIONS.map((s) => (
                    <button
                        key={s.key}
                        className={`nav-item flex-1 ${section === s.key ? 'nav-item-active' : ''}`}
                        onClick={() => navigate(`/section/${s.key}`)}
                    >
                        <span className="nav-icon font-bold text-lg">
                            {s.key === 'THE_SIXTH' ? 'س' : s.key === 'EYES' ? 'ع' : s.key}
                        </span>
                    </button>
                ))}
            </div>
        </Layout>
    );
};

export default AppLayout;