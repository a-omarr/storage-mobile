import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar.tsx';
import Sidebar from './Sidebar.tsx';

const { Content } = Layout;

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <Navbar />
            <Layout hasSider style={{ marginTop: 64 }}>
                <Sidebar />
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
        </Layout>
    );
};

export default AppLayout;
