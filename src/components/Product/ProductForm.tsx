import React, { useState } from 'react';
import {
    Form,
    Input,
    Select,
    InputNumber,
    DatePicker,
    Button,
    Space,
    Divider,
    Alert,
} from 'antd';
import { SaveOutlined, CameraOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { SECTIONS } from '../../constants/sections';
import type { ProductFormData, SectionKey } from '../../types/product';
import CameraCapture from '../Camera/CameraCapture';
import type { ParsedOCRData } from '../../utils/ocrParser';

const { Option } = Select;

interface ProductFormProps {
    initialValues?: Partial<ProductFormData>;
    defaultSection?: SectionKey;
    onSubmit: (data: ProductFormData) => Promise<void>;
    loading?: boolean;
    isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
    initialValues,
    defaultSection,
    onSubmit,
    loading = false,
    isEdit = false,
}) => {
    const [form] = Form.useForm();
    const [showCamera, setShowCamera] = useState(false);
    const [ocrSuccess, setOcrSuccess] = useState(false);

    // When OCR returns data, fill the form fields
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

    // Convert Date to dayjs for the initial form values
    const formInitials = initialValues
        ? {
            ...initialValues,
            dateOfProduction: initialValues.dateOfProduction
                ? dayjs(initialValues.dateOfProduction)
                : undefined,
            section: initialValues.section || defaultSection,
        }
        : { section: defaultSection };

    const labelStyle = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };

    return (
        <>
            {/* OCR Camera Modal */}
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
                {/* Camera Button */}
                <div style={{ marginBottom: 20 }}>
                    {ocrSuccess && (
                        <Alert
                            message="تم قراءة البيانات من الصورة بنجاح ✓"
                            type="success"
                            showIcon
                            closable
                            style={{ marginBottom: 12, fontFamily: 'Cairo, sans-serif' }}
                        />
                    )}
                    <Button
                        size="large"
                        icon={<CameraOutlined />}
                        onClick={() => setShowCamera(true)}
                        style={{
                            width: '100%',
                            height: 52,
                            borderRadius: 12,
                            borderStyle: 'dashed',
                            borderColor: '#1677ff',
                            color: '#1677ff',
                            fontFamily: 'Cairo, sans-serif',
                            fontSize: 16,
                            fontWeight: 600,
                        }}
                    >
                        قراءة الإيصال بالكاميرا
                    </Button>
                </div>

                <Divider style={{ margin: '8px 0 20px' }}>أو أدخل البيانات يدوياً</Divider>

                {/* Section */}
                <Form.Item
                    label={<span style={labelStyle}>القسم</span>}
                    name="section"
                    rules={[{ required: true, message: 'يرجى اختيار القسم' }]}
                >
                    <Select size="large" placeholder="اختر القسم" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {SECTIONS.map((s) => (
                            <Option key={s.key} value={s.key}>
                                {s.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Type + Capacity */}
                <Space style={{ width: '100%' }} size={12}>
                    <Form.Item
                        label={<span style={labelStyle}>نوع المنتج</span>}
                        name="type"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 0 }}
                    >
                        <Input size="large" placeholder="مثال: Bordeaux" />
                    </Form.Item>
                    <Form.Item
                        label={<span style={labelStyle}>السعة</span>}
                        name="capacity"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 0 }}
                    >
                        <Input size="large" placeholder="مثال: 750 ML" />
                    </Form.Item>
                </Space>

                {/* Item No + Batch Number */}
                <Space style={{ width: '100%' }} size={12}>
                    <Form.Item
                        label={<span style={labelStyle}>رقم الصنف</span>}
                        name="itemNo"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 0 }}
                    >
                        <Input size="large" placeholder="مثال: 264" />
                    </Form.Item>
                    <Form.Item
                        label={<span style={labelStyle}>رقم الدفعة</span>}
                        name="batchNumber"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 0 }}
                    >
                        <Input size="large" placeholder="مثال: 264-006" />
                    </Form.Item>
                </Space>

                {/* Color + Finish Type */}
                <Space style={{ width: '100%' }} size={12}>
                    <Form.Item
                        label={<span style={labelStyle}>اللون</span>}
                        name="color"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 0 }}
                    >
                        <Input size="large" placeholder="مثال: Flint" />
                    </Form.Item>
                    <Form.Item
                        label={<span style={labelStyle}>نوع الغطاء</span>}
                        name="finishType"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 0 }}
                    >
                        <Input size="large" placeholder="مثال: CORK" />
                    </Form.Item>
                </Space>

                {/* Numeric fields */}
                <Space style={{ width: '100%' }} size={12} wrap>
                    <Form.Item
                        label={<span style={labelStyle}>كمية لكل طبقة</span>}
                        name="qtyPerLayer"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 140 }}
                    >
                        <InputNumber size="large" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label={<span style={labelStyle}>عدد الطبقات</span>}
                        name="numberOfLayers"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 140 }}
                    >
                        <InputNumber size="large" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label={<span style={labelStyle}>قطع لكل بالت</span>}
                        name="piecesPerPallet"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 140 }}
                    >
                        <InputNumber size="large" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label={<span style={labelStyle}>عدد البالتات</span>}
                        name="numberOfPallet"
                        rules={[{ required: true, message: 'مطلوب' }]}
                        style={{ flex: 1, minWidth: 140 }}
                    >
                        <InputNumber size="large" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Space>

                {/* Date of Production */}
                <Form.Item
                    label={<span style={labelStyle}>تاريخ الإنتاج</span>}
                    name="dateOfProduction"
                    rules={[{ required: true, message: 'يرجى إدخال تاريخ الإنتاج' }]}
                >
                    <DatePicker
                        size="large"
                        format="DD/MM/YYYY"
                        style={{ width: '100%', fontFamily: 'Cairo, sans-serif' }}
                        placeholder="DD/MM/YYYY"
                    />
                </Form.Item>

                {/* Submit */}
                <Form.Item style={{ marginTop: 8 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        icon={<SaveOutlined />}
                        style={{
                            width: '100%',
                            height: 52,
                            borderRadius: 12,
                            fontFamily: 'Cairo, sans-serif',
                            fontSize: 16,
                            fontWeight: 700,
                        }}
                    >
                        {isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ProductForm;
