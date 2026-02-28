import { useState } from 'react';
import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { ProductFormData, SectionKey } from '../../../types/product';
import type { ParsedOCRData } from '../../../utils/ocrParser';
import { SECTION_MAP } from '../../../constants/sections';

interface UseProductFormProps {
    initialValues?: Partial<ProductFormData>;
    defaultSections?: SectionKey[];
    onSubmit: (data: ProductFormData) => Promise<void>;
    inventory?: 1 | 2;
}

export interface OCRFeedback {
    status: 'success' | 'warning' | null;
    message: string;
    missingFields: string[];
}

export const useProductForm = ({
    initialValues,
    defaultSections = [],
    onSubmit,
    inventory,
}: UseProductFormProps) => {
    const [form] = Form.useForm();
    const [showCamera, setShowCamera] = useState(false);
    const [ocrFeedback, setOcrFeedback] = useState<OCRFeedback>({ status: null, message: '', missingFields: [] });

    // Watch sections to determine inventory
    const sectionsWatch = Form.useWatch<SectionKey[]>('sections', form) || defaultSections;

    // Logic: If explicit inventory is passed (Edit mode), use it. 
    // Otherwise derive from selected sections (Add mode).
    const selectedInventory: 1 | 2 = inventory || (sectionsWatch.some(s => SECTION_MAP[s]?.inventory === 2) ? 2 : 1);

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
            sections: values.sections || [],
            inventory: selectedInventory,
            type: (values.type || '').trim(),
            capacity: values.capacity ? String(values.capacity).trim() : undefined,
            itemNo: values.itemNo ? String(values.itemNo).trim() : undefined,
            batchNumber: values.batchNumber ? String(values.batchNumber).trim() : undefined,
            color: values.color ? String(values.color).trim() : undefined,
            finishType: values.finishType ? String(values.finishType).trim() : undefined,
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
            sections: initialValues.sections || defaultSections,
        }
        : { sections: defaultSections };

    return {
        form,
        showCamera,
        setShowCamera,
        ocrFeedback,
        setOcrFeedback,
        handleOCRResult,
        handleFinish,
        formInitials,
        selectedInventory,
    };
};
