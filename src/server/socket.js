import { Server } from 'socket.io';
import axios from 'axios';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    socket.on('message', async (msg) => {
      socket.emit('message', msg);
      try {
        const response = await axios.post('http://localhost:3000/api/chat', { message: msg.content });
        socket.emit('message', { content: response.data.reply, sender: 'bot' });
      } catch (err) {
        socket.emit('message', { content: 'Sorry, failed to get response from AI.', sender: 'bot' });
      }
    });
  });

  console.log('Socket server initialized');
  res.end();
}