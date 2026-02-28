import React from 'react';
import { Form, Input, Select } from 'antd';
import { SECTIONS } from '../../../constants/sections';

const { Option } = Select;
const labelStyle = { fontFamily: 'Cairo, sans-serif', fontWeight: 600 };

interface Props {
    inventory?: 1 | 2;
    isEdit?: boolean;
}

const ProductFormBasicInfo: React.FC<Props> = ({ inventory = 1, isEdit = false }) => (
    <>
        <Form.Item
            label={<span style={labelStyle}>الأقسام</span>}
            name="sections"
            rules={[{ required: true, message: 'يرجى اختيار قسم واحد على الأقل' }]}
            tooltip={isEdit ? 'لا يمكن تعديل الأقسام من هنا. استخدم زر الحذف لإزالة المنتج من قسم محدد.' : undefined}
        >
            <Select
                mode="multiple"
                size="large"
                placeholder="اختر الأقسام"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                disabled={isEdit}
            >
                {(isEdit ? SECTIONS.filter(s => s.inventory === inventory) : SECTIONS).map((s) => (
                    <Option key={s.key} value={s.key}>{s.label}</Option>
                ))}
            </Select>
        </Form.Item>

        <div className="flex flex-col sm:flex-row gap-3">
            <Form.Item
                label={<span style={labelStyle}>نوع المنتج</span>}
                name="type"
                rules={[{ required: true, message: 'مطلوب' }]}
                className="flex-1 min-w-0 mb-6"
            >
                <Input size="large" placeholder="مثال: Bordeaux" />
            </Form.Item>

            {inventory === 1 && (
                <Form.Item
                    label={<span style={labelStyle}>السعة</span>}
                    name="capacity"
                    rules={[{ required: true, message: 'مطلوب' }]}
                    className="flex-1 min-w-0 mb-6"
                >
                    <Input size="large" placeholder="مثال: 750 ML" />
                </Form.Item>
            )}
        </div>
    </>
);

export default ProductFormBasicInfo;
