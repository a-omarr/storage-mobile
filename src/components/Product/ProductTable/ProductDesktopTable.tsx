import React from 'react';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../types/product';
import { getProductColumns } from './productColumns';
import ProductEmptyState from './ProductEmptyState';
import { useProductDelete } from './useProductDelete';

interface Props {
    products: Product[];
    loading: boolean;
    showSection: boolean;
    sortOrder: 'asc' | 'desc';
    toggleSort: () => void;
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    toggleAll: (ids: string[]) => void;
}

const ProductDesktopTable: React.FC<Props> = ({
    products, loading, showSection, sortOrder, toggleSort,
    selectedIds, toggleAll
}) => {
    const navigate = useNavigate();
    const { handleDelete } = useProductDelete();

    const columns = getProductColumns({
        showSection, sortOrder, toggleSort, handleDelete, navigate
    });

    return (
        <div className="hidden md:block">
            <Table
                dataSource={products}
                columns={columns}
                rowKey={(record: any) => record.displaySection ? `${record.id}::${record.displaySection}` : record.id}
                rowSelection={{
                    selectedRowKeys: selectedIds,
                    onChange: (selectedRowKeys) => {
                        // toggleAll handles bulk replacement of the selection state
                        toggleAll(selectedRowKeys as string[]);
                    },
                }}
                loading={loading}
                scroll={{ x: 1100 }}
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total) => `إجمالي ${total} منتج`,
                    position: ['bottomCenter'],
                }}
                onRow={(record) => ({
                    style: { cursor: 'pointer' },
                    onClick: (e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('.ant-btn') || target.closest('.ant-popover')) return;
                        const queryParam = record.displaySection ? `?section=${record.displaySection}` : '';
                        navigate(`/product/${record.id}${queryParam}`);
                    },
                })}
                locale={{ emptyText: <ProductEmptyState /> }}
                size="middle"
            />
        </div>
    );
};

export default ProductDesktopTable;
