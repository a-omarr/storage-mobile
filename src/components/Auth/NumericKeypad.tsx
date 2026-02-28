import React from 'react';
import { Button } from 'antd';
import { FiDelete } from 'react-icons/fi';

interface Props {
    onNumber: (num: string) => void;
    onDelete: () => void;
}

const NumericKeypad: React.FC<Props> = ({ onNumber, onDelete }) => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

    return (
        <div className="grid grid-cols-3 gap-6 max-w-[300px] mx-auto mt-8">
            {numbers.map((val, idx) => {
                if (val === '') return <div key={idx} />;
                if (val === 'delete') {
                    return (
                        <div key={idx} className="flex items-center justify-center">
                            <Button
                                type="text"
                                icon={<FiDelete size={28} />}
                                onClick={onDelete}
                                style={{
                                    height: 70,
                                    width: 70,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%'
                                }}
                                className="text-gray-400 hover:text-red-500 border-none bg-transparent shadow-none"
                            />
                        </div>
                    );
                }
                return (
                    <Button
                        key={idx}
                        onClick={() => onNumber(val)}
                        style={{
                            height: 75,
                            width: 75,
                            borderRadius: '50%',
                            fontSize: 28,
                            fontWeight: 600,
                            fontFamily: 'Cairo, sans-serif',
                            border: '1px solid #f0f0f0',
                            background: '#fff',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            color: '#1f2937'
                        }}
                    >
                        {val}
                    </Button>
                );
            })}
        </div>
    );
};

export default NumericKeypad;
