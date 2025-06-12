"use client";

import { useEffect, useState } from "react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  thinking?: boolean;
  onTypingComplete?: () => void;
}

export default function ChatBubble({
  message,
  isUser,
  thinking = false,
  onTypingComplete,
}: ChatBubbleProps) {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [dotCount, setDotCount] = useState(0);

  const parseMessage = (text: string): string[] => {
    const lines = text.split("\n");
    const parsed: string[] = [];

    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    for (const line of lines) {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock) {
          parsed.push("```" + codeBuffer.join("\n") + "```");
          codeBuffer = [];
        }
        continue;
      }
      if (inCodeBlock) {
        codeBuffer.push(line);
      } else if (line.trim() !== "") {
        parsed.push(line);
      }
    }
    return parsed;
  };

  useEffect(() => {
    if (thinking) {
      setDisplayText([]);
      return;
    }

    if (!message) {
      setDisplayText(["⚠️ Error: Empty message."]);
      return;
    }

    const lines = parseMessage(message);

    if (isUser) {
      setDisplayText(lines);
    } else {
      let currentLine = 0;
      let currentChar = 0;
      let tempLines: string[] = Array(lines.length).fill("");

      const interval = setInterval(() => {
        if (currentLine < lines.length) {
          tempLines[currentLine] += lines[currentLine][currentChar] || "";
          setDisplayText([...tempLines]);
          currentChar++;
          if (currentChar >= lines[currentLine].length) {
            currentLine++;
            currentChar = 0;
          }
        } else {
          clearInterval(interval);
          if (onTypingComplete) onTypingComplete();
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [message, isUser, thinking]);

  useEffect(() => {
    if (thinking) {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [thinking]);

  const renderFormattedLine = (line: string, index: number) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const inlineCodeRegex = /`([^`]+)`/g;

    if (line.startsWith("```")) {
      const codeContent = line.replace(/```/g, "").trim();
      return (
        <pre key={index} className="bg-[#0f172a] text-[#38bdf8] text-sm rounded p-3 overflow-x-auto">
          <code>{codeContent}</code>
        </pre>
      );
    }

    const parts = line
      .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
      .map((part, idx) => {
        if (boldRegex.test(part)) {
          return (
            <strong key={idx} className="font-bold text-yellow-500">
              {part.replace(/\*\*/g, "")}
            </strong>
          );
        } else if (inlineCodeRegex.test(part)) {
          return (
            <code key={idx} className="bg-[#1e293b] text-[#f472b6] px-1 py-0.5 rounded text-sm">
              {part.replace(/`/g, "")}
            </code>
          );
        } else {
          return part;
        }
      });

    if (/^(\d+\.)/.test(line)) {
      return <li key={index} className="ml-4 list-decimal">{parts}</li>;
    }

    if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
      return <li key={index} className="ml-4 list-disc">{parts}</li>;
    }

    return <p key={index}>{parts}</p>;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-4 px-3`}>
      <div
        className={`relative max-w-xl p-4 rounded-xl shadow-lg transition-all min-w-[200px] 
          ${isUser
            ? "bg-gradient-to-tr from-[#0f172a] to-[#334155] border border-[#38bdf8] text-[#f8fafc]"
            : "bg-gradient-to-tr from-[#020617] to-[#1e293b] border border-[#9333ea] text-[#f8fafc]"
          }
        backdrop-blur-xl scale-105 duration-300`}
      >
        <div className="absolute top-0 left-0 m-2 text-xs font-semibold text-[#94a3b8]">
          {isUser ? "You" : "Advokey AI"}
        </div>

        <div className="text-sm space-y-2 mt-5">
          {thinking ? (
            <div className="flex items-center">
              <span className="animate-pulse text-[#38bdf8] font-bold">
                {".".repeat(dotCount).padEnd(3, " ")}
              </span>
            </div>
          ) : (
            displayText.map((line, i) => renderFormattedLine(line, i))
          )}
        </div>
      </div>
    </div>
  );
}
