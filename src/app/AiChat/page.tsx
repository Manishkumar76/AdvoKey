"use client";

import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/app/components/ui/chatBubble";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
};

type ChatSession = {
  id: number;
  title: string;
  messages: Message[];
};

export default function AdvokeyChatPage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: 1, title: "New Chat", messages: [] },
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [input, setInput] = useState("");
  const [counter, setCounter] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeSession = chatSessions.find((s) => s.id === activeSessionId)!;
  const messages = activeSession.messages;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userId = counter + 1;
    setCounter(userId);

    const userMessage: Message = { id: userId, role: "user", content: input };
    updateSessionMessages([...messages, userMessage]);
    setInput("");

    const loadingId = userId + 1;
    setCounter(loadingId);

    updateSessionMessages((prev) => [...prev, { id: loadingId, role: "assistant", content: "", typing: true }]);

    try {
      const res = await fetch("/api/aiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();
      const assistantContent =
        typeof data.message === "string" ? data.message : "Sorry, I couldn't understand.";

      updateSessionMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId ? { ...msg, content: assistantContent, typing: false } : msg
        )
      );
    } catch {
      updateSessionMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { ...msg, content: "Error: Failed to fetch AI response.", typing: false }
            : msg
        )
      );
    }
  };

  const updateSessionMessages = (
    newMessages:
      | Message[]
      | ((prev: Message[]) => Message[])
  ) => {
    setChatSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              messages:
                typeof newMessages === "function"
                  ? newMessages(session.messages)
                  : newMessages,
            }
          : session
      )
    );
  };

  const handleNewChat = () => {
    const newId = chatSessions.length + 1;
    setChatSessions([...chatSessions, { id: newId, title: `Chat ${newId}`, messages: [] }]);
    setActiveSessionId(newId);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-screen pt-16">

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Chat History</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                session.id === activeSessionId ? "bg-gray-700" : ""
              }`}
            >
              {session.title}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
          >
            + New Chat
          </button>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 py-3 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Legal AI Chat</h1>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-900">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.content}
              isUser={msg.role === "user"}
              thinking={msg.typing}
            />
          ))}
        </div>

        <div className="flex border-t bg-white dark:bg-gray-800 px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a legal question..."
            className="flex-grow px-4 py-2 border rounded-l-md bg-white dark:bg-gray-700 text-sm"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 rounded-r-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
