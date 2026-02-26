import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SECTIONS } from '../../constants/sections';
import type { SectionKey } from '../../types/product';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { section } = useParams<{ section?: SectionKey }>();

    return (
        <div className="w-[68px] bg-white border-l border-[#e2e8f0] flex flex-col items-center pt-3 pb-3 gap-1.5 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0">
            {/* Home */}
            <button
                onClick={() => navigate('/')}
                className="w-12 h-12 rounded-[12px] border-2 cursor-pointer flex flex-col items-center justify-center text-xl transition-all duration-200"
                style={{
                    borderColor: !section ? '#1677ff' : 'transparent',
                    background: !section ? '#e6f4ff' : 'transparent',
                }}
                title="الرئيسية"
            >
                🏠
            </button>

            <div className="w-8 h-px bg-[#e2e8f0] my-1" />

            {SECTIONS.map((s) => {
                const isActive = section === s.key;
                return (
                    <button
                        key={s.key}
                        onClick={() => navigate(`/section/${s.key}`)}
                        className="w-12 h-12 rounded-[12px] border-2 cursor-pointer flex flex-col items-center justify-center text-sm font-bold transition-all duration-200 font-['Cairo',sans-serif]"
                        style={{
                            borderColor: isActive ? s.color : 'transparent',
                            background: isActive ? s.bgColor : 'transparent',
                            color: isActive ? s.color : 'var(--color-text-muted)',
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
