import { useAllProducts } from './useAllProducts';
import AllProductsHeader from './AllProductsHeader';
import AllProductsItem from './AllProductsItem';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyIllustration from '../../components/Common/EmptyIllustration';
import { useProductSelection } from '../../hooks/useProductSelection';
import BulkDeleteBar from '../../components/Product/ProductTable/BulkDeleteBar';
import { useProductDelete } from '../../components/Product/ProductTable/useProductDelete';

const AllProductsPage: React.FC = () => {
    const { sorted, loading, sortOrder, toggleSort, searchTerm, setSearchTerm, refresh } = useAllProducts();
    const { selectedIds, toggleSelection, clearSelection } = useProductSelection();
    const { handleBulkDelete } = useProductDelete();

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
                <div className="flex flex-col gap-3 relative pb-16">
                    {sorted.map((p: any) => {
                        const compoundKey = p.displaySection ? `${p.id}::${p.displaySection}` : p.id;
                        return (
                            <AllProductsItem
                                key={compoundKey}
                                product={p}
                                isSelected={selectedIds.includes(compoundKey)}
                                onToggleSelect={() => toggleSelection(compoundKey)}
                            />
                        );
                    })}

                    <BulkDeleteBar
                        selectedCount={selectedIds.length}
                        onDelete={() => handleBulkDelete(selectedIds, { onRefresh: refresh })}
                        onCancel={clearSelection}
                    />
                </div>
            )}
        </div>
    );
};

export default AllProductsPage;
