import React from 'react';
import { Layout, Button, Typography, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { FiSearch, FiSettings, FiDownload, FiUpload, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useDataExport } from '../../hooks/useDataExport';
import { useDataImport } from '../../hooks/useDataImport';

const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { lock } = useAuth();
    const { exportData, isExporting } = useDataExport();

    // Refresh the page or navigate home after a successful import
    const { importData, isImporting } = useDataImport(() => {
        window.location.href = '/';
    });

    const menuItems: MenuProps['items'] = [
        {
            key: 'export',
            label: 'تصدير نسخة احتياطية',
            icon: <FiDownload />,
            onClick: exportData
        },
        {
            key: 'import',
            label: 'استعادة من نسخة احتياطية',
            icon: <FiUpload />,
            onClick: importData
        }
    ];

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
                <div className="w-10 h-10 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    <img src="./logo.svg" alt="مدير المخزن" className="w-full h-full object-contain" />
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

            <div className="flex items-center gap-2">
                <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<FiSettings style={{ fontSize: 22 }} />}
                        style={{ color: 'white' }}
                        title="الإعدادات"
                        loading={isExporting || isImporting}
                    />
                </Dropdown>

                <Button
                    type="text"
                    icon={<FiLock style={{ fontSize: 22 }} />}
                    style={{ color: 'white' }}
                    onClick={lock}
                    title="قفل التطبيق"
                />

                <Button
                    type="text"
                    icon={<FiSearch style={{ fontSize: 22 }} />}
                    style={{ color: 'white' }}
                    onClick={() => navigate('/search')}
                    title="البحث"
                />
            </div>
        </Header>
    );
};

export default Navbar;
