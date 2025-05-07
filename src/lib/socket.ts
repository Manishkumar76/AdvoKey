// lib/socket.js
import { AnyARecord } from 'dns'
import { DefaultEventsMap, Server } from 'socket.io'

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export function initSocket(server:any) {
  if (!io) {
    io = new Server(server, { path: '/api/socket' })
    io.on('connection', (socket) => {
      socket.on('joinChat', (sessionId) => socket.join(sessionId))
      socket.on('sendMessage', ({ sessionId, message }) => {
        io.to(sessionId).emit('newMessage', { sender: 'Lawyer/Client', text: message })
      })
    })
  }
  return io
}
