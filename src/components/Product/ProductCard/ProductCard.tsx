import React from 'react';
import { Card, Divider } from 'antd';
import type { Product } from '../../../types/product';
import { daysOld } from '../../../utils/dateHelpers';
import ProductCardHeader from './ProductCardHeader';
import ProductCardWarning from './ProductCardWarning';
import ProductCardBody from './ProductCardBody';
import ProductCardActions from './ProductCardActions';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const days = daysOld(product.dateOfProduction);
    const isOld = days > 365;

    return (
        <Card
            style={{
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: 'none',
                overflow: 'hidden',
            }}
            bodyStyle={{ padding: 0 }}
        >
            <ProductCardHeader product={product} />
            <div className="p-6">
                {isOld && <ProductCardWarning days={days} />}
                <ProductCardBody product={product} />
                <Divider />
                <ProductCardActions productId={product.id} />
            </div>
        </Card>
    );
};

export default ProductCard;
