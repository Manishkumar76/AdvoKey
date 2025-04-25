'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import Lottie from "lottie-react";
import loadingAnimation from '@/app/assets/animation/page_loading.json';

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

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/api/my-chats'); // Replace with your real API endpoint
        setChats(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch chats.');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    try {
      await axios.delete(`/api/chats/${id}`);
      setChats((prev) => prev.filter((chat) => chat._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete chat.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 pt-20">
        <Lottie animationData={loadingAnimation} loop />
      </div>
    );
  }
  if (error) return <div className="text-center pt-20 text-red-600">{error}</div>;

  return (
    <div className="pt-20 px-4 max-w-screen mx-auto bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center ">💬 Chats</h1>

      <div className="flex flex-col gap-3">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500">No chats available.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className="bg-white rounded-2xl shadow border p-4 flex items-center gap-4 hover:shadow-md transition"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                {chat.lawyer_id?.user?.username?.slice(0, 2).toUpperCase()}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg truncate">
                    {chat.lawyer_id?.user?.username || 'Unknown Lawyer'}
                  </h2>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatTime(chat.created_at)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {chat.lastMessage || 'No messages yet'}
                </p>

                <Link
                  href={`/dashboard/${chat.lawyer_id._id}/chat/${chat._id}`}
                  className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                >
                  {chat.is_active ? 'Continue Chat' : 'View Chat'}
                </Link>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(chat._id)}
                className="text-gray-400 hover:text-red-600"
                title="Delete Chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
