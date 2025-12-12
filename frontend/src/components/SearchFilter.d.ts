import React from 'react';
export interface SearchFilterProps {
    onSearch: (searchTerm: string) => void;
    onFilterChange: (filters: FilterState) => void;
    sectors?: string[];
    industries?: string[];
    placeholder?: string;
}
export interface FilterState {
    sector?: string;
    industry?: string;
}
export declare const SearchFilter: React.FC<SearchFilterProps>;
