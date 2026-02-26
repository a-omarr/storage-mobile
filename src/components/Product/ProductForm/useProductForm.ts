import { useState } from 'react';
import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { ProductFormData, SectionKey } from '../../../types/product';
import type { ParsedOCRData } from '../../../utils/ocrParser';

interface UseProductFormProps {
    initialValues?: Partial<ProductFormData>;
    defaultSection?: SectionKey;
    onSubmit: (data: ProductFormData) => Promise<void>;
}

export const useProductForm = ({
    initialValues,
    defaultSection,
    onSubmit,
}: UseProductFormProps) => {
    const [form] = Form.useForm();
    const [showCamera, setShowCamera] = useState(false);
    const [ocrSuccess, setOcrSuccess] = useState(false);

    const handleOCRResult = (data: ParsedOCRData) => {
        const updates: Record<string, any> = {};
        if (data.type) updates.type = data.type;
        if (data.capacity) updates.capacity = data.capacity;
        if (data.itemNo) updates.itemNo = data.itemNo;
        if (data.batchNumber) updates.batchNumber = data.batchNumber;
        if (data.color) updates.color = data.color;
        if (data.finishType) updates.finishType = data.finishType;
        if (data.qtyPerLayer !== undefined) updates.qtyPerLayer = data.qtyPerLayer;
        if (data.numberOfLayers !== undefined) updates.numberOfLayers = data.numberOfLayers;
        if (data.piecesPerPallet !== undefined) updates.piecesPerPallet = data.piecesPerPallet;
        if (data.numberOfPallet !== undefined) updates.numberOfPallet = data.numberOfPallet;
        if (data.dateOfProduction) updates.dateOfProduction = dayjs(data.dateOfProduction);

        form.setFieldsValue(updates);
        setShowCamera(false);
        setOcrSuccess(true);
        setTimeout(() => setOcrSuccess(false), 4000);
    };

    const handleFinish = async (values: any) => {
        const data: ProductFormData = {
            section: values.section,
            type: values.type?.trim(),
            capacity: values.capacity?.trim(),
            itemNo: values.itemNo?.trim(),
            batchNumber: values.batchNumber?.trim(),
            color: values.color?.trim(),
            finishType: values.finishType?.trim(),
            qtyPerLayer: values.qtyPerLayer,
            numberOfLayers: values.numberOfLayers,
            piecesPerPallet: values.piecesPerPallet,
            numberOfPallet: values.numberOfPallet,
            dateOfProduction: (values.dateOfProduction as Dayjs)?.toDate() ?? null,
        };
        await onSubmit(data);
    };

    const formInitials = initialValues
        ? {
            ...initialValues,
            dateOfProduction: initialValues.dateOfProduction
                ? dayjs(initialValues.dateOfProduction)
                : undefined,
            section: initialValues.section || defaultSection,
        }
        : { section: defaultSection };

    return {
        form,
        showCamera,
        setShowCamera,
        ocrSuccess,
        handleOCRResult,
        handleFinish,
        formInitials,
    };
};
