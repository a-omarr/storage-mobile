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

export interface OCRFeedback {
    status: 'success' | 'warning' | null;
    message: string;
    missingFields: string[];
}

export const useProductForm = ({
    initialValues,
    defaultSection,
    onSubmit,
}: UseProductFormProps) => {
    const [form] = Form.useForm();
    const [showCamera, setShowCamera] = useState(false);
    const [ocrFeedback, setOcrFeedback] = useState<OCRFeedback>({ status: null, message: '', missingFields: [] });

    const handleOCRResult = (data: ParsedOCRData) => {
        const updates: Record<string, any> = {};
        const fieldMap: Record<string, string> = {
            type: 'النوع',
            capacity: 'السعة',
            itemNo: 'رقم الصنف',
            batchNumber: 'رقم التشغيلة',
            color: 'اللون',
            finishType: 'نوع النهاية',
            qtyPerLayer: 'الكمية في الطبقة',
            numberOfLayers: 'عدد الطبقات',
            piecesPerPallet: 'القطع في الطبلية',
            numberOfPallet: 'عدد الطبالي',
            dateOfProduction: 'تاريخ الإنتاج'
        };

        const missingFields: string[] = [];

        Object.keys(fieldMap).forEach(key => {
            const val = (data as any)[key];
            if (val !== undefined && val !== null && val !== '') {
                if (key === 'dateOfProduction') {
                    updates[key] = dayjs(val);
                } else {
                    updates[key] = val;
                }
            } else {
                missingFields.push(fieldMap[key]);
            }
        });

        form.setFieldsValue(updates);
        setShowCamera(false);

        const confidence = data.confidence ?? 0;
        const status = confidence >= 50 ? 'success' : 'warning';
        const message = confidence >= 50
            ? 'تم قراءة البيانات بنجاح ✓'
            : 'تحقق من البيانات، قد تكون غير دقيقة ⚠️';

        setOcrFeedback({ status, message, missingFields });

        // Auto-clear feedback after 8 seconds if it's a success
        if (status === 'success') {
            setTimeout(() => setOcrFeedback(prev => ({ ...prev, status: null })), 8000);
        }
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
        ocrFeedback,
        setOcrFeedback,
        handleOCRResult,
        handleFinish,
        formInitials,
    };
};
