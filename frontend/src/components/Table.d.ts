import React from 'react';
export interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, item: T) => React.ReactNode;
    className?: string;
}
export interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    error?: Error | null;
    onSort?: (sortBy: keyof T, sortOrder: 'asc' | 'desc') => void;
    keyExtractor?: (item: T) => string;
    className?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare const Table: React.ForwardRefExoticComponent<TableProps<any> & React.RefAttributes<HTMLDivElement>>;
