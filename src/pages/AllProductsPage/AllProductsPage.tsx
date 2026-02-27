import { useAllProducts } from './useAllProducts';
import AllProductsHeader from './AllProductsHeader';
import AllProductsItem from './AllProductsItem';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyIllustration from '../../components/Common/EmptyIllustration';

const AllProductsPage: React.FC = () => {
    const { sorted, loading, sortOrder, toggleSort, searchTerm, setSearchTerm } = useAllProducts();

    return (
        <div className="pb-10">
            <AllProductsHeader
                total={sorted.length}
                loading={loading}
                sortOrder={sortOrder}
                toggleSort={toggleSort}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {loading ? (
                <LoadingSkeleton.AllProducts />
            ) : sorted.length === 0 ? (
                <EmptyIllustration
                    variant={searchTerm ? 'search' : 'general'}
                    message={searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد منتجات مضافة بعد'}
                />
            ) : (
                <div className="flex flex-col gap-3">
                    {sorted.map((p) => (
                        <AllProductsItem key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllProductsPage;
