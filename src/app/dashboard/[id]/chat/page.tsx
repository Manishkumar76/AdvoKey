'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

const mockChats = [
  {
    _id: '1',
    is_active: true,
    created_at: new Date().toISOString(),
    lastMessage: 'Hello, I need help with a contract.',
    lawyer_id: {
      _id: 'lawyer1',
      user: {
        username: 'advocate_john',
      },
    },
  },
  {
    _id: '2',
    is_active: false,
    created_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
    lastMessage: 'Sure, we can schedule a call tomorrow.',
    lawyer_id: {
      _id: 'lawyer2',
      user: {
        username: 'lawyer_lisa',
      },
    },
  },
];

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
  return (
    <div className="pt-20 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">💬 Chats</h1>

      <div className="flex flex-col gap-3">
        {mockChats.map((chat) => (
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
                href={`/chat/${chat._id}`}
                className="text-sm text-blue-500 hover:underline mt-2 inline-block"
              >
                {chat.is_active ? 'Continue Chat' : 'View Chat'}
              </Link>
            </div>

            {/* Delete */}
            <button
              onClick={() => alert(`Would delete chat ${chat._id}`)}
              className="text-gray-400 hover:text-red-600"
              title="Delete Chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
