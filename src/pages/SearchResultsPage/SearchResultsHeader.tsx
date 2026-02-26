import React from 'react';
import { Typography } from 'antd';
import { FiSearch } from 'react-icons/fi';
import SearchBar from '../../components/Search/SearchBar';

const { Title } = Typography;

interface Props {
    query: string;
    setQuery: (val: string) => void;
}

const SearchResultsHeader: React.FC<Props> = ({ query, setQuery }) => (
    <div className="bg-gradient-to-br from-[#1677ff] to-[#0958d9] rounded-[12px] px-6 py-4 mb-5">
        <Title level={4} style={{ color: 'white', margin: 0, fontFamily: 'Cairo, sans-serif', marginBottom: 12 }}>
            <FiSearch className="inline ml-2" />
            البحث في المخزن
        </Title>
        <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="ابحث بالنوع، اللون، رقم الصنف، رقم الدفعة..."
        />
    </div>
);

export default SearchResultsHeader;
