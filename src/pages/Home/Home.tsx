import React from 'react';
import { Typography } from 'antd';
import { FiPackage } from 'react-icons/fi';
import { useHome } from './useHome';
import HomeStatsBar from './HomeStatsBar';
import HomeSectionGrid from './HomeSectionGrid';
import HomeOldestWidget from './HomeOldestWidget';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';

const { Text } = Typography;

const Home: React.FC = () => {
    const { products, loading, counts, oldest } = useHome();

    if (loading) {
        return (
            <div>
                <LoadingSkeleton.Stats />
                <LoadingSkeleton.Grid />
                <LoadingSkeleton.Oldest />
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
