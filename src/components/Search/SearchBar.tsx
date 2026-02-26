import React from 'react';
import { Input } from 'antd';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = 'ابحث عن منتج...',
}) => {
    return (
        <Input
            size="large"
            prefix={<FiSearch style={{ color: '#94a3b8', fontSize: 18, marginLeft: 8 }} />}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            allowClear
            style={{
                borderRadius: 14,
                fontFamily: 'Cairo, sans-serif',
                fontSize: 16,
                height: 52,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
        />
    );
};

export default SearchBar;
