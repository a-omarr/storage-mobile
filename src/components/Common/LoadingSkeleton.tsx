import React from 'react';
import { Skeleton, Card } from 'antd';

// ── Stats Bar Skeleton ────────────────────────────────────────────────────────
const StatsSkeleton: React.FC = () => (
    <div className="bg-gradient-to-br from-[#1677ff] to-[#0958d9] rounded-[12px] px-5 py-4 mb-5">
        <Skeleton.Input active size="small" style={{ width: 120, marginBottom: 8, display: 'block', background: 'rgba(255,255,255,0.3)' }} />
        <Skeleton.Input active size="large" style={{ width: 80, background: 'rgba(255,255,255,0.3)' }} />
    </div>
);

// ── Section Cards Grid Skeleton ───────────────────────────────────────────────
const GridSkeleton: React.FC = () => (
    <div className="grid max-[360px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-7">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[12px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <Skeleton.Avatar active size={44} shape="square" style={{ borderRadius: 12, marginBottom: 10 }} />
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
            </div>
        ))}
    </div>
);

// ── Product Table / List Skeleton ─────────────────────────────────────────────
const TableSkeleton: React.FC = () => (
    <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden p-4">
        {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-4">
                <Skeleton active paragraph={{ rows: 2 }} title={{ width: '40%' }} />
                {i < 4 && <div className="border-b border-[#f0f0f0] mt-4" />}
            </div>
        ))}
    </div>
);

// ── Product Detail Card Skeleton ──────────────────────────────────────────────
const DetailSkeleton: React.FC = () => (
    <Card
        style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', border: 'none', overflow: 'hidden' }}
        styles={{ body: { padding: 0 } }}
    >
        {/* Header */}
        <div className="px-6 py-5 bg-[#e8f0fe]">
            <Skeleton.Input active size="small" style={{ width: 80, marginBottom: 12, display: 'block' }} />
            <Skeleton.Input active size="large" style={{ width: 220, marginBottom: 8, display: 'block' }} />
            <Skeleton.Input active size="small" style={{ width: 140 }} />
        </div>
        {/* Body */}
        <div className="p-6">
            <Skeleton active paragraph={{ rows: 6 }} />
            <div className="flex justify-end mt-4">
                <Skeleton.Button active size="large" style={{ width: 120 }} />
            </div>
        </div>
    </Card>
);

// ── Oldest Widget Skeleton ────────────────────────────────────────────────────
const OldestSkeleton: React.FC = () => (
    <Card
        style={{ borderRadius: 'var(--radius-md)', border: '1px solid #fde68a', background: '#fffbeb' }}
        styles={{ body: { padding: '16px 20px' } }}
    >
        <Skeleton.Input active size="small" style={{ width: 180, marginBottom: 12, display: 'block' }} />
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-3">
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '50%' }} />
            </div>
        ))}
    </Card>
);

// ── All Products List Skeleton ────────────────────────────────────────────────
const AllProductsSkeleton: React.FC = () => (
    <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[12px] px-5 py-4 shadow-sm border border-[#e2e8f0]">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <Skeleton.Avatar active size={40} shape="square" style={{ borderRadius: 10 }} />
                        <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
                    </div>
                    <Skeleton.Input active size="small" style={{ width: 80 }} />
                </div>
            </div>
        ))}
    </div>
);

// ── Full Page / Auth Check Skeleton ──────────────────────────────────────────
const PageSkeleton: React.FC = () => (
    <div className="min-h-screen bg-[#f8fafc] p-6">
        <div className="max-w-[1200px] mx-auto">
            <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 24, display: 'block' }} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card style={{ borderRadius: 12, marginBottom: 24 }}>
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </Card>
                </div>
                <div>
                    <Card style={{ borderRadius: 12 }}>
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </Card>
                </div>
            </div>
        </div>
    </div>
);

// ── Named exports ─────────────────────────────────────────────────────────────
const LoadingSkeleton = {
    Stats: StatsSkeleton,
    Grid: GridSkeleton,
    Table: TableSkeleton,
    Detail: DetailSkeleton,
    Oldest: OldestSkeleton,
    AllProducts: AllProductsSkeleton,
    Page: PageSkeleton,
};

export default LoadingSkeleton;
