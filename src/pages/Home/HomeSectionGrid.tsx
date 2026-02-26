import React from 'react';
import { Typography } from 'antd';
import { SECTIONS } from '../../constants/sections';
import HomeSectionCard from './HomeSectionCard';

const { Title } = Typography;

interface Props {
    counts: Record<string, number>;
}

const HomeSectionGrid: React.FC<Props> = ({ counts }) => (
    <>
        <Title level={4} style={{ fontFamily: 'Cairo, sans-serif', marginBottom: 14 }}>
            الأقسام
        </Title>
        <div className="grid max-[360px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-7">
            {SECTIONS.map((s) => (
                <HomeSectionCard
                    key={s.key}
                    sectionKey={s.key}
                    label={s.label}
                    color={s.color}
                    gradient={s.gradient}
                    count={counts[s.key] || 0}
                />
            ))}
        </div>
    </>
);

export default HomeSectionGrid;
