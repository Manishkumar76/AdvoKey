'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { Message } from '@/helpers/interfaces/message';

interface Chat {
  _id: string;
  is_active: boolean;
  created_at: string;
  lastMessage?: string;
  lawyer_id: {
    _id: string;
    user: {
      username: string;
    };
  };
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hrs ago`;
  return date.toLocaleDateString();
}

export default function ChatLayoutPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/api/my-chats');
        setChats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleSelectChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    try {
      const res = await axios.get(`/api/messages/${chatId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    }
  };

  useEffect(() => {
    // Clear any previous interval
    if (pollingRef.current) clearInterval(pollingRef.current);

    if (selectedChatId) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`/api/messages/${selectedChatId}`);
          setMessages(res.data);
        } catch (err) {
          console.error('Polling failed:', err);
        }
      };

      // Initial fetch
      fetchMessages();

      // Polling every 5 seconds
      pollingRef.current = setInterval(fetchMessages, 5000);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedChatId]);

  const handleDelete = async () => {
    if (!chatToDelete) return;
    try {
      await axios.delete(`/api/chats/${chatToDelete}`);
      setChats((prev) => prev.filter((chat) => chat._id !== chatToDelete));
      if (selectedChatId === chatToDelete) setSelectedChatId(null);
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to delete chat.');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChatId) return;

    const message: Message = {
      senderId: 'clientId123',
      receiverId: 'lawyerId456',
      chatId: selectedChatId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post('/api/messages', message);
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Sidebar Chat List */}
      <aside className="w-1/4 p-4 border-r bg-white dark:bg-gray-800 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">💬 Chats</h2>
        {loading ? (
          <p>Loading chats...</p>
        ) : chats.length === 0 ? (
          <p>No chats available.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`p-3 mb-2 rounded-lg cursor-pointer border ${selectedChatId === chat._id
                ? 'bg-blue-100 border-blue-600'
                : 'bg-gray-100 hover:bg-gray-200'
                }`}
              onClick={() => handleSelectChat(chat._id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold truncate text-blue-600">{chat.lawyer_id?.user?.username}</h3>
                <span className="text-xs text-gray-500">{formatTime(chat.created_at)}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-1">
                {chat.lastMessage || 'No messages yet'}
              </p>
              <div className="flex justify-between mt-1 text-sm">
                <span className="text-blue-600">
                  {chat.is_active ? 'Continue Chat' : 'View Chat'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                    setChatToDelete(chat._id);
                  }}
                  className="text-gray-400 hover:text-red-600"
                  title="Delete Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </aside>

      {/* Main Chat Panel */}
      <main className="flex-1 p-4 flex flex-col bg-gray-50">
        {selectedChatId ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg max-w-xs ${msg.senderId === 'clientId123'
                    ? 'bg-blue-600 text-white self-end ml-auto'
                    : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white self-start mr-auto'
                    }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex mt-4">
              <input
                className="flex-1 border rounded-l p-2 bg-white dark:bg-gray-700 dark:text-white"
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging.
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white">
              Are you sure you want to delete this chat?
            </h3>
            <div className="flex justify-center flex-row gap-6">
              <button
                className="bg-gray-300 text-black dark:text-white px-4 py-2 rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={handleDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
