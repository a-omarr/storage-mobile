import React from 'react';
import { useHome } from './useHome';
import HomeStatsBar from './HomeStatsBar';
import HomeSectionGrid from './HomeSectionGrid';
import HomeOldestWidget from './HomeOldestWidget';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyIllustration from '../../components/Common/EmptyIllustration';

const Home: React.FC = () => {
    const { products, loading: dataLoading, counts, oldest } = useHome();

    if (dataLoading) {
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
            {products.length === 0 && <EmptyIllustration variant="home" />}
        </div>
    );
};

export default Home;
