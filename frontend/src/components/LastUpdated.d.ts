import React from 'react';
export interface LastUpdatedProps {
    timestamp: Date | null;
    loading?: boolean;
    onRefresh?: () => void;
}
export declare const LastUpdated: React.FC<LastUpdatedProps>;
