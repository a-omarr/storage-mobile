import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SECTIONS } from '../../constants/sections';
import type { SectionKey } from '../../types/product';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { section } = useParams<{ section?: SectionKey }>();

    return (
        <div
            style={{
                width: 68,
                background: 'var(--color-surface)',
                borderLeft: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 12,
                paddingBottom: 12,
                gap: 6,
                position: 'sticky',
                top: 64,
                height: 'calc(100vh - 64px)',
                overflowY: 'auto',
                flexShrink: 0,
            }}
        >
            {/* Home */}
            <button
                onClick={() => navigate('/')}
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    border: '2px solid',
                    borderColor: !section ? '#1677ff' : 'transparent',
                    background: !section ? '#e6f4ff' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    transition: 'all 0.2s',
                }}
                title="الرئيسية"
            >
                🏠
            </button>

            <div
                style={{
                    width: 32,
                    height: 1,
                    background: 'var(--color-border)',
                    margin: '4px 0',
                }}
            />

            {SECTIONS.map((s) => {
                const isActive = section === s.key;
                return (
                    <button
                        key={s.key}
                        onClick={() => navigate(`/section/${s.key}`)}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            border: '2px solid',
                            borderColor: isActive ? s.color : 'transparent',
                            background: isActive ? s.bgColor : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 700,
                            color: isActive ? s.color : 'var(--color-text-muted)',
                            transition: 'all 0.2s',
                            fontFamily: 'Cairo, sans-serif',
                        }}
                        title={s.label}
                    >
                        {s.key === 'THE_SIXTH' ? 'س' : s.key === 'EYES' ? 'ع' : s.key}
                    </button>
                );
            })}
        </div>
    );
};

export default Sidebar;
