import React from 'react';
import { Spin, Typography } from 'antd';
import { FiPackage } from 'react-icons/fi';
import { useHome } from './useHome';
import HomeStatsBar from './HomeStatsBar';
import HomeSectionGrid from './HomeSectionGrid';
import HomeOldestWidget from './HomeOldestWidget';

const { Text } = Typography;

const Home: React.FC = () => {
    const { products, loading, counts, oldest } = useHome();

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <HomeStatsBar total={products.length} />
            <HomeSectionGrid counts={counts} />
            <HomeOldestWidget oldest={oldest} />
            {products.length === 0 && (
                <div className="text-center py-[60px] text-[#6b7c93]">
                    <FiPackage className="text-[60px] mb-3 mx-auto" />
                    <Text style={{ fontFamily: 'Cairo, sans-serif', fontSize: 16 }}>
                        لا توجد منتجات مضافة بعد
                    </Text>
                </div>
            )}
        </div>
    );
};

export default Home;
