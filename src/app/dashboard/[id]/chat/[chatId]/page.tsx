// src/app/chat/[chatId]/page.tsx
'use client'

import { JSX, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import useSocket from '@/helpers/customHooks/useSocket'
import { Message } from '@/helpers/interfaces/message'
import axios from 'axios'

export default function ChatPage(): JSX.Element {
  const { chatId } = useParams<{ chatId: string }>()
  const socket = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>('')

  useEffect(() => {
    if (!socket || !chatId) return

    socket.emit('joinRoom', { chatId })

    const handleReceiveMessage = (message: Message) => {
      setMessages((prev) => [...prev, message])
    }

    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
    }
  }, [socket, chatId])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message: Message = {
      senderId: 'clientId123', // Replace with dynamic session ID
      receiverId: 'lawyerId456', // Replace with dynamic target
      chatId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    socket?.emit('sendMessage', message)

    try {
      await axios.post('/api/messages', message)
      setMessages((prev) => [...prev, message])
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 p-4 border-r hidden md:block">
        Chat List
      </aside>

      <main className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-xs ${
                msg.senderId === 'clientId123'
                  ? 'bg-blue-600 text-white self-end'
                  : 'bg-gray-200 text-black self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex mt-4">
          <input
            className="flex-1 border rounded-l p-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-600 text-white px-4 rounded-r"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  )
}
