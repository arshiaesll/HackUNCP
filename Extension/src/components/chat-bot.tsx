import React, { useState } from "react";
import { Message } from "../util/types";

type ChatBotProps = {
  messages: Message[];
  onSend: (message: string) => Promise<void>;
};

export default function ChatBot({ messages, onSend }: ChatBotProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  async function handleSend() {
    setIsLoading(true);
    await onSend(input);
    setInput("");
    setIsLoading(false);
  }

  return (
    <div>
      {messages.map((m) => (
        <p key={m.text}>{m.text}</p>
      ))}
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={isLoading} onClick={handleSend}>
          {isLoading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}
