import React, { useState } from "react";
import { Message } from "../util/types";

type ChatBotProps = {
  messages: Message[];
};

export default function ChatBot({ messages }: ChatBotProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

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
        <button disabled={isLoading}>Send</button>
      </div>
    </div>
  );
}
