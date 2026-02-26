import React from 'react';
import { FiPackage } from 'react-icons/fi';

const ProductEmptyState: React.FC = () => (
    <div className="py-10 text-center text-[#6b7c93]">
        <FiPackage className="text-[40px] mb-2 mx-auto" />
        <div>لا توجد منتجات في هذا القسم</div>
    </div>
);

export default ProductEmptyState;
