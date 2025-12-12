export interface WebSocketMessage<T = any> {
    type: 'stocks_update' | 'price_change' | 'error' | 'connected';
    data: T;
    timestamp: number;
}
export interface UseWebSocketOptions {
    url?: string;
    autoConnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}
/**
 * WebSocket hook for real-time stock updates (stub for future implementation)
 * Currently returns null to indicate WebSocket is not yet implemented
 *
 * Future implementation will:
 * - Connect to backend WebSocket server
 * - Receive real-time stock updates
 * - Handle reconnection logic
 * - Broadcast updates to subscribers
 */
export declare const useWebSocket: <T = any>(options?: UseWebSocketOptions) => {
    connected: boolean;
    lastMessage: WebSocketMessage<T>;
    error: Error;
    connect: () => void;
    disconnect: () => void;
    send: (data: any) => void;
};
