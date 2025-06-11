"use client";

import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/app/components/ui/chatBubble";
import { SunIcon, MoonIcon } from "lucide-react";

type Messages = {
  role: "user" | "assistant";
  content: string;
};

const ADVOKEYAGENT = {
  name: "Advokey AI",
  image: "lawyer_vector.jpeg",
};

export default function AdvokeyChatPage() {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkAvailability = () => {
      const now = new Date();
      const hour = now.getHours();
      const available = true;
      setIsAvailable(available);
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !isAvailable) return;

    const userMessage: Messages = { role: "user", content: input };
    const newMessages: Messages[] = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/aiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const assistantMessage: Messages = {
        role: "assistant",
        content: typeof data.message === "string" ? data.message : "Sorry, I couldn't understand.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: failed to fetch AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden p-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 pt-16">
        
        {/* Sidebar (Hidden on mobile) */}
        <aside className="hidden md:flex w-64 flex-col bg-white/30 dark:bg-white/10 backdrop-blur-lg shadow-lg border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center p-6 border-b dark:border-gray-700">
            <img
              src={ADVOKEYAGENT.image}
              alt="Profile"
              className="w-16 h-16 rounded-full mb-2"
            />
            <div className="text-lg font-semibold">{ADVOKEYAGENT.name}</div>
          </div>

          <div className="flex-grow overflow-auto p-4 space-y-2">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Chat History
            </div>
            {messages.length === 0 ? (
              <div className="text-gray-400 text-sm">No chats yet.</div>
            ) : (
              messages
                .filter((msg) => msg.role === "user")
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className="text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    {msg.content.slice(0, 40)}...
                  </div>
                ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 md:px-6 py-4 border-b dark:border-gray-700">
            <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
              Legal AI Chat
            </h1>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200 hover:text-blue-600"
            >
              {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Availability Banner */}
          {!isAvailable && (
            <div className="text-center bg-blue-100 text-blue-800 p-2 text-sm font-medium">
              Chat is only available between 9:00 AM and 6:00 PM.
            </div>
          )}

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex flex-col flex-grow p-3 md:p-4 overflow-y-auto"
          >
            {messages.map((msg, i) =>
              msg.content ? (
                <ChatBubble
                  key={i}
                  message={msg.content}
                  isUser={msg.role === "user"}
                  darkMode={darkMode}
                />
              ) : null
            )}

            {loading && <ChatBubble message="Thinking..." isUser={false} />}
          </div>

          {/* Input Box */}
          <div className="flex border-t bg-white dark:bg-gray-800 px-3 py-2 md:px-4 md:py-3 border-gray-200 dark:border-gray-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isAvailable
                  ? "Ask a legal question..."
                  : "Chat is available from 9:00 AM to 6:00 PM"
              }
              disabled={!isAvailable}
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-black dark:text-white disabled:opacity-50 text-sm"
              onKeyDown={(e) => isAvailable && e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!isAvailable}
              className={`px-4 md:px-6 py-2 rounded-r-md text-white text-sm ${
                isAvailable
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
