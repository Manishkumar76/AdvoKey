// src/app/api/socket/route.js
import { Server } from 'socket.io'

let io

export function GET(request) {
  if (!io) {
    io = new Server(globalThis.socketServer || request.socket.server, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
      },
    })

    globalThis.socketServer = request.socket.server

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('joinRoom', ({ chatId }) => {
        socket.join(chatId)
      })

      socket.on('sendMessage', (message) => {
        io.to(message.chatId).emit('receiveMessage', message)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }

  return new Response('Socket.IO server ready')
}
