import React from 'react';
export interface PaginationProps {
    page: number;
    totalPages: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}
export declare const Pagination: React.FC<PaginationProps>;
