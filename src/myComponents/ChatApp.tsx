"use client";
import React, { useEffect, useState, KeyboardEvent, useRef } from "react";

interface Message {
  _id: string;
  sender: string;
  content: string;
  createdAt: string;
}

interface ChatAppProps {
  groupId?: string;
  receiverId?: string;
}

const ChatApp: React.FC<ChatAppProps> = ({ groupId, receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch messages on mount and when groupId or receiverId changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let url = "";
        if (groupId) {
          url = `/api/messages?groupId=${groupId}`;
        } else if (receiverId) {
          url = `/api/messages?receiverId=${receiverId}`;
        } else {
          setError("No receiverId or groupId provided");
          return;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
          setError(null);
        } else if (data.error) {
          setError(data.error);
          setMessages([]);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to fetch messages");
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [groupId, receiverId]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const payload: any = { content: newMessage };
      if (groupId) {
        payload.groupId = groupId;
      } else if (receiverId) {
        payload.receiverId = receiverId;
      } else {
        setError("No receiverId or groupId provided");
        return;
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.newMessage]);
        setNewMessage("");
        setError(null);
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error sending message");
    }
  };

  // Pressing Enter to send
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    // Entire page uses a light-gray background so the chat still stands out
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col w-full max-w-md h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-800 text-2xl font-semibold">Chat</h2>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 text-lg">👥</span>
          </div>
        </div>

        {/* Messages List */}
        <div
          ref={messageListRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50"
        >
          {messages.length > 0 ? (
            messages.map((msg) => {
              // Replace this with your actual “own” sender logic
              const isOwnMessage = msg.sender === "me";

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative max-w-[75%] pt-2 pb-6 px-4 rounded-lg shadow-sm ${
                      isOwnMessage
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    {/* Timestamp is absolutely positioned at bottom-right */}
                    <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No messages yet.</p>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSendMessage}
            className="ml-3 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Error Message Overlay */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
