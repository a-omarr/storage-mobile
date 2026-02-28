import type { SectionKey } from '../types/product';

export interface SectionConfig {
    key: SectionKey;
    label: string;
    color: string;
    bgColor: string;
    gradient: string;
    inventory: 1 | 2;
}

export const SECTIONS: SectionConfig[] = [
    {
        key: 'A',
        label: 'القسم A',
        color: '#1677ff',
        bgColor: '#e6f4ff',
        gradient: 'linear-gradient(135deg, #1677ff, #0958d9)',
        inventory: 1,
    },
    {
        key: 'B',
        label: 'القسم B',
        color: '#52c41a',
        bgColor: '#f6ffed',
        gradient: 'linear-gradient(135deg, #52c41a, #389e0d)',
        inventory: 1,
    },
    {
        key: 'C',
        label: 'القسم C',
        color: '#722ed1',
        bgColor: '#f9f0ff',
        gradient: 'linear-gradient(135deg, #722ed1, #531dab)',
        inventory: 1,
    },
    {
        key: 'D',
        label: 'القسم D',
        color: '#fa8c16',
        bgColor: '#fff7e6',
        gradient: 'linear-gradient(135deg, #fa8c16, #d46b08)',
        inventory: 1,
    },
    {
        key: 'THE_SIXTH',
        label: 'القسم السادس',
        color: '#eb2f96',
        bgColor: '#fff0f6',
        gradient: 'linear-gradient(135deg, #eb2f96, #c41d7f)',
        inventory: 2,
    },
    {
        key: 'EYES',
        label: 'قسم العينين',
        color: '#13c2c2',
        bgColor: '#e6fffb',
        gradient: 'linear-gradient(135deg, #13c2c2, #08979c)',
        inventory: 2,
    },
];

export const SECTION_MAP: Record<SectionKey, SectionConfig> = Object.fromEntries(
    SECTIONS.map((s) => [s.key, s])
) as Record<SectionKey, SectionConfig>;
