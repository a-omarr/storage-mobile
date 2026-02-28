import React from 'react';
import { useHome } from './useHome';
import HomeStatsBar from './HomeStatsBar';
import HomeSectionGrid from './HomeSectionGrid';
import HomeOldestWidget from './HomeOldestWidget';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyIllustration from '../../components/Common/EmptyIllustration';

const Home: React.FC = () => {
    const { products, loading: dataLoading, counts, oldest, totalCount } = useHome();

    return dataLoading ? (
        <div>
            <LoadingSkeleton.Stats />
            <LoadingSkeleton.Grid />
            <LoadingSkeleton.Oldest />
        </div>
    ) : (
        <div>
            <HomeStatsBar total={totalCount} />
            <div className="mb-8">
                <HomeOldestWidget oldest={oldest} />
            </div>
            <HomeSectionGrid counts={counts} />
            {products.length === 0 && <EmptyIllustration variant="home" />}
        </div>
    );
};

export default Home;
