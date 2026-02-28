import { useState } from 'react';
import { Form, Button } from 'antd';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { ProductFormData, SectionKey } from '../../../types/product';
import CameraCapture from '../../Camera/CameraCapture';
import { useProductForm } from './useProductForm';
import ProductFormCameraButton from './ProductFormCameraButton';
import ProductFormBasicInfo from './ProductFormBasicInfo';
import ProductFormIdentifiers from './ProductFormIdentifiers';
import ProductFormDetails from './ProductFormDetails';
import ProductFormPallet from './ProductFormPallet';
import ProductFormDate from './ProductFormDate';
import ProductFormSubmitButton from './ProductFormSubmitButton';

interface Props {
    initialValues?: Partial<ProductFormData>;
    defaultSections?: SectionKey[];
    onSubmit: (data: ProductFormData) => Promise<void>;
    loading?: boolean;
    isEdit?: boolean;
}

const ProductForm: React.FC<Props> = ({
    initialValues,
    defaultSections,
    onSubmit,
    loading = false,
    isEdit = false,
}) => {
    const {
        form,
        showCamera,
        setShowCamera,
        ocrFeedback,
        setOcrFeedback,
        handleOCRResult,
        handleFinish,
        formInitials,
        selectedInventory,
    } = useProductForm({ initialValues, defaultSections, onSubmit });

    const [isAdvancedOpen, setIsAdvancedOpen] = useState(isEdit); // Open by default on edit

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
                    ocrFeedback={ocrFeedback}
                    onOpenCamera={() => setShowCamera(true)}
                    onClearFeedback={() => setOcrFeedback({ status: null, message: '', missingFields: [] })}
                />

                <ProductFormBasicInfo inventory={selectedInventory} />

                {/* For Inventory 1, Date is at the top. For Inventory 2, it's in Advanced. */}
                {selectedInventory === 1 && <ProductFormDate inventory={1} />}

                {selectedInventory === 1 ? (
                    <>
                        <ProductFormIdentifiers />
                        <ProductFormDetails />
                        <ProductFormPallet />
                    </>
                ) : (
                    <div className="mt-2 mb-6">
                        <Button
                            type="link"
                            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                            icon={isAdvancedOpen ? <FiChevronUp /> : <FiChevronDown />}
                            style={{ padding: 0, height: 'auto', fontFamily: 'Cairo, sans-serif' }}
                        >
                            {isAdvancedOpen ? 'إخفاء الخيارات الإضافية' : 'المزيد من الخيارات (اختياري)'}
                        </Button>

                        {isAdvancedOpen && (
                            <div className="mt-4 pt-4 border-t border-gray-100 italic-fields">
                                <ProductFormDate inventory={2} />
                                <ProductFormIdentifiers inventory={2} />
                                <ProductFormDetails inventory={2} />
                                <ProductFormPallet inventory={2} />
                            </div>
                        )}
                    </div>
                )}

                <ProductFormSubmitButton loading={loading} isEdit={isEdit} />
            </Form>
        </>
    );
};

export default ProductForm;
