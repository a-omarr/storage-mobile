import React from 'react';
import { Typography } from 'antd';
import { SECTIONS } from '../../constants/sections';
import HomeSectionCard from './HomeSectionCard';

const { Title } = Typography;

interface Props {
    counts: Record<string, number>;
}

const HomeSectionGrid: React.FC<Props> = ({ counts }) => {
    const inventory1 = SECTIONS.filter(s => s.inventory === 1);
    const inventory2 = SECTIONS.filter(s => s.inventory === 2);

    const renderGrid = (sections: typeof SECTIONS, title: string) => (
        <div className="mb-8">
            <Title level={4} style={{
                fontFamily: 'Cairo, sans-serif',
                marginBottom: 16,
                paddingRight: 4,
                borderRight: '4px solid #1677ff',
                lineHeight: '1.2'
            }}>
                {title}
            </Title>
            <div className="grid max-[360px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {sections.map((s) => (
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
        </div>
    );

    return (
        <div className="mt-4">
            {renderGrid(inventory1, 'المخزن 1')}
            {renderGrid(inventory2, 'المخزن 2')}
        </div>
    );
};

export default HomeSectionGrid;
