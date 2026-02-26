import React from 'react';
import { Form } from 'antd';
import type { ProductFormData, SectionKey } from '../../../types/product';
import CameraCapture from '../../Camera/CameraCapture';
import { useProductForm } from './useProductForm';
import ProductFormCameraButton from './ProductFormCameraButton';
import ProductFormBasicInfo from './ProductFormBasicInfo';
import ProductFormIdentifiers from './ProductFormIdentifiers';
import ProductFormDetails from './ProductFormDetails';
import ProductFormPallet from './ProductFormPallet';
import ProductFormDate from './ProductFormDate';

interface Props {
    initialValues?: Partial<ProductFormData>;
    defaultSection?: SectionKey;
    onSubmit: (data: ProductFormData) => Promise<void>;
    loading?: boolean;
    isEdit?: boolean;
}

const ProductForm: React.FC<Props> = ({
    initialValues,
    defaultSection,
    onSubmit,
    loading = false,
    isEdit = false,
}) => {
    const {
        form,
        showCamera,
        setShowCamera,
        ocrSuccess,
        handleOCRResult,
        handleFinish,
        formInitials,
    } = useProductForm({ initialValues, defaultSection, onSubmit });

    return (
        <>
            {showCamera && (
                <CameraCapture
                    onResult={handleOCRResult}
                    onClose={() => setShowCamera(false)}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                initialValues={formInitials}
                onFinish={handleFinish}
                style={{ fontFamily: 'Cairo, sans-serif' }}
                requiredMark={false}
            >
                <ProductFormCameraButton
                    ocrSuccess={ocrSuccess}
                    onOpenCamera={() => setShowCamera(true)}
                />
                <ProductFormBasicInfo />
                <ProductFormIdentifiers />
                <ProductFormDetails />
                <ProductFormPallet />
                <ProductFormDate loading={loading} isEdit={isEdit} />
            </Form>
        </>
    );
};

export default ProductForm;
