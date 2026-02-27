import React, { useRef, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

interface Props {
    children: React.ReactNode;
    onDelete: () => void;
}

const ProductMobileCardSwipe: React.FC<Props> = ({ children, onDelete }) => {
    const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);
    const currentX = useRef(0);
    const threshold = 120; // threshold to trigger delete or snap back

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        currentX.current = e.touches[0].clientX;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;
        currentX.current = e.touches[0].clientX;
        const diff = currentX.current - startX.current;

        // Only allow swiping to the left (negative diff)
        if (diff < 0) {
            setOffsetX(diff);
        } else {
            setOffsetX(0);
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        if (offsetX < -threshold) {
            // Trigger delete if swiped beyond threshold
            onDelete();
            // Snap back after a short delay (or if deletion is cancelled)
            setOffsetX(0);
        } else {
            // Snap back
            setOffsetX(0);
        }
    };

    return (
        <div className="relative overflow-hidden mb-3 rounded-[12px]">
            {/* Delete Background */}
            <div
                className="absolute inset-y-0 right-0 w-full bg-[#ef4444] flex items-center justify-end px-8 transition-opacity duration-200"
                style={{
                    opacity: Math.min(Math.abs(offsetX) / threshold, 1),
                }}
            >
                <div
                    className="flex flex-col items-center text-white gap-2 transition-transform duration-200"
                    style={{
                        transform: `scale(${Math.min(0.5 + Math.abs(offsetX) / (threshold * 2), 1.1)})`,
                    }}
                >
                    <FiTrash2 size={28} />
                    <span className="text-xs font-['Cairo',sans-serif] font-bold">حذف</span>
                </div>
            </div>

            {/* Swipable Content */}
            <div
                style={{
                    transform: `translate3d(${offsetX}px, 0, 0)`,
                    transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </div>
        </div>
    );
};

export default ProductMobileCardSwipe;
