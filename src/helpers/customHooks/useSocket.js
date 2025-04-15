
'use client'

import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export default function useSocket() {
  const socket = useRef(null)

  useEffect(() => {
    if (!socket.current) {
      socket.current = io({
        path: '/api/socket/io',
      })
    }
    return () => {
      socket.current?.disconnect()
    }
  }, [])

  return socket.current
}
