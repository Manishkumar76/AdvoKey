'use client'

import { useEffect, useRef, useState } from 'react'
import io,{ Socket } from 'socket.io-client'

let socketInstance: typeof Socket | null = null

export default function useSocket():typeof Socket | null {
  const [socket, setSocket] = useState< typeof Socket | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      if (!socketInstance) {
        socketInstance = io({
          path: '/api/socket/io',
        })
      }

      setSocket(socketInstance)
    }

    return () => {
      // Disconnect if needed
      // Uncomment below line if you want to close socket on unmount
      socketInstance?.disconnect()
    }
  }, [])

  return socket
}
