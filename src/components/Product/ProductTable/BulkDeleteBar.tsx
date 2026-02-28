import React from 'react';
import { createPortal } from 'react-dom';
import { Button, App } from 'antd';
import { FiTrash2 } from 'react-icons/fi';

interface Props {
    selectedCount: number;
    onDelete: () => void;
    onCancel: () => void;
}

const BulkDeleteBar: React.FC<Props> = ({ selectedCount, onDelete, onCancel }) => {
    const { modal } = App.useApp();

    if (selectedCount === 0) return null;

    const showDeleteConfirm = () => {
        modal.confirm({
            title: `حذف ${selectedCount} عناصر`,
            content: 'هل أنت متأكد من حذف هذه العناصر نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
            okText: 'نعم، احذف',
            cancelText: 'تراجع',
            okType: 'danger',
            onOk: onDelete,
            centered: true,
            style: { fontFamily: 'Cairo, sans-serif' },
            okButtonProps: { style: { fontFamily: 'Cairo, sans-serif' }, danger: true },
            cancelButtonProps: { style: { fontFamily: 'Cairo, sans-serif' } },
        });
    };

    return createPortal(
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 px-6 py-4 flex items-center gap-6 min-w-[320px] max-w-[90vw] animate-[slideUp_0.3s_ease-out]">
            <div className="flex flex-col">
                <span className="font-['Cairo'] text-sm text-gray-500">تم تحديد</span>
                <span className="font-['Cairo'] font-bold text-lg text-blue-600 leading-none">{selectedCount} عناصر</span>
            </div>

            <div className="flex items-center gap-3 mr-auto">
                <Button
                    type="text"
                    onClick={onCancel}
                    className="font-['Cairo'] text-gray-400 hover:text-gray-600"
                >
                    إلغاء
                </Button>

                <Button
                    type="primary"
                    danger
                    icon={<FiTrash2 />}
                    onClick={showDeleteConfirm}
                    className="font-['Cairo'] rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
                >
                    حذف المحدد
                </Button>
            </div>
        </div>,
        document.body
    );
};

export default BulkDeleteBar;
