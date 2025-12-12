import { useEffect, useState, useCallback } from 'react'

export interface WebSocketMessage<T = any> {
  type: 'stocks_update' | 'price_change' | 'error' | 'connected'
  data: T
  timestamp: number
}

export interface UseWebSocketOptions {
  url?: string
  autoConnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
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
export const useWebSocket = <T = any>(
  options: UseWebSocketOptions = {}
) => {
  const {
    url = process.env.VITE_WS_URL || 'ws://localhost:3000',
    autoConnect = false,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options

  const [connected, setConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage<T> | null>(
    null
  )
  const [error, setError] = useState<Error | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)

  const connect = useCallback(() => {
    if (!url || url.startsWith('ws://localhost') && !autoConnect) {
      console.log(
        'WebSocket: Stub implementation - real-time updates not yet available'
      )
      setConnected(false)
      return
    }

    try {
      const socket = new WebSocket(url)

      socket.onopen = () => {
        setConnected(true)
        setError(null)
      }

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage<T>
          setLastMessage(message)
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      socket.onerror = (error) => {
        setError(
          error instanceof Error
            ? error
            : new Error('WebSocket connection error')
        )
        setConnected(false)
      }

      socket.onclose = () => {
        setConnected(false)
      }

      setWs(socket)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to connect to WebSocket')
      )
    }
  }, [url, autoConnect])

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close()
      setWs(null)
      setConnected(false)
    }
  }, [ws])

  const send = useCallback(
    (data: any) => {
      if (ws && connected) {
        try {
          ws.send(JSON.stringify(data))
        } catch (err) {
          console.error('Failed to send WebSocket message:', err)
        }
      } else {
        console.warn('WebSocket not connected')
      }
    },
    [ws, connected]
  )

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    connected,
    lastMessage,
    error,
    connect,
    disconnect,
    send,
  }
}
