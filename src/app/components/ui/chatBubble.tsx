"use client";

import { useEffect, useState } from "react";

export default function ChatBubble({
  message,
  isUser,
  darkMode,
}: {
  message: string;
  isUser: boolean;
  darkMode?: boolean;
}) {
  const [displayText, setDisplayText] = useState<string[]>([]);

  const parseMessage = (text: string): string[] => {
    return text.split("\n").filter((line) => line.trim() !== "");
  };

  useEffect(() => {
    if (!message) {
      setDisplayText(["⚠️ Error: Empty message."]);
      return;
    }

    const lines = parseMessage(message);

    if (isUser) {
      setDisplayText(lines);
    } else {
      setDisplayText([]);

      let currentLine = 0;
      let currentChar = 0;
      let tempLines: string[] = Array(lines.length).fill("");

      const intervalDelay = 15;

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
        }
      }, intervalDelay);

      return () => clearInterval(interval);
    }
  }, [message, isUser]);

  const renderFormattedLine = (line: string, index: number) => {
    // Match bold text: **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    // Match inline code: `code`
    const inlineCodeRegex = /`([^`]+)`/g;

    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, idx) => {
      if (boldRegex.test(part)) {
        return (
          <strong key={idx} className="font-semibold">
            {part.replace(/\*\*/g, "")}
          </strong>
        );
      } else if (inlineCodeRegex.test(part)) {
        return (
          <code
            key={idx}
            className="bg-gray-200 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-xs"
          >
            {part.replace(/`/g, "")}
          </code>
        );
      } else {
        return part;
      }
    });

    if (/^(\d+\.)/.test(line)) {
      return (
        <li key={index} className="ml-4 list-decimal">
          {parts}
        </li>
      );
    }

    if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
      return (
        <li key={index} className="ml-4 list-disc">
          {parts}
        </li>
      );
    }

    if (line.startsWith("```") && line.endsWith("```")) {
      return (
        <pre
          key={index}
          className="bg-gray-200 dark:bg-gray-800 text-sm rounded p-2 overflow-x-auto"
        >
          <code>{line.slice(3, -3)}</code>
        </pre>
      );
    }

    return <p key={index}>{parts}</p>;
  };

  return (
    <div
      className={`max-w-xl my-2 px-4 py-2 rounded-xl shadow-md backdrop-blur-lg transition-all
        ${
          isUser
            ? darkMode
              ? "ml-auto bg-blue-800 text-white"
              : "ml-auto bg-blue-600 text-white"
            : darkMode
            ? "mr-auto bg-gray-700 text-gray-100"
            : "mr-auto bg-white/30 text-black"
        }
      `}
    >
      <div className="font-semibold">{isUser ? "You" : "Advokey AI"}</div>
      <div className="text-sm text-gray-500">
        {isUser ? "" : new Date().toLocaleString()}
      </div>
      <div className="text-sm whitespace-pre-wrap mt-1 space-y-1">
        {displayText.map((line, i) => renderFormattedLine(line, i))}
      </div>
    </div>
  );
}
