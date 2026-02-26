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
                <div className="hidden md:block">
                    <Sidebar />
                </div>
                <Content
                    style={{
                        padding: '0',
                        background: 'var(--color-bg)',
                        minHeight: 'calc(100vh - 64px)',
                    }}
                    className="pb-20 md:pb-0"
                >
                    <div className="max-w-[1200px] mx-auto p-4 md:pb-6 pb-20 page-enter">{children}</div>
                </Content>
            </Layout>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-[#e2e8f0] flex justify-around items-center z-[1000] px-2 [padding-bottom:env(safe-area-inset-bottom)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SECTIONS.map((s) => (
                    <button
                        key={s.key}
                        className={`flex flex-col items-center gap-1 text-[10px] font-['Cairo',sans-serif] border-0 bg-transparent cursor-pointer flex-1 ${section === s.key ? 'text-[#1677ff]' : 'text-[#6b7c93]'}`}
                        onClick={() => navigate(`/section/${s.key}`)}
                    >
                        <span className="text-xl font-bold">
                            {s.key === 'THE_SIXTH' ? 'س' : s.key === 'EYES' ? 'ع' : s.key}
                        </span>
                    </button>
                ))}
            </div>
        </Layout>
    );
};

export default AppLayout;