import React, { CSSProperties, useRef, useState } from "react";
import { fontSize, Message } from "../util/types";

type ChatBotProps = {
  messages: Message[];
  onSend: (message: string) => Promise<void>;
};

export default function ChatBot({ messages, onSend }: ChatBotProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  async function handleSend() {
    setIsLoading(true);
    await onSend(input);
    setInput("");
    setIsLoading(false);
    // scroll container ref to bottom
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "10em",
        gap: "0.5em",
        overflowY: "auto",
      }}
    >
      {messages.map((m) => (
        <p key={m.text} style={m.role === "user" ? userStyles : aiStyles}>
          {m.text}
        </p>
      ))}
      <div
        style={{
          position: "fixed",
          bottom: "0.5em",
          right: "0.5em",
          width: "calc(25vw - 1em)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
        }}
      >
        <textarea
          placeholder="Ask me questions about the text"
          style={{
            width: "100%",
            resize: "none",
            fontSize,
            padding: "0.25em",
            border: "1px solid #333",
            borderRadius: "0.5em",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          disabled={isLoading}
          onClick={handleSend}
          style={{
            width: "100%",
            backgroundColor: "#333",
            fontWeight: 600,
            paddingBlock: "0.5em",
            border: "none",
            outline: "none",
            borderRadius: "0.5em",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const userStyles: CSSProperties = {
  marginLeft: "auto",
  textAlign: "right",
  maxWidth: "70%",
  fontSize,
  wordBreak: "break-all",
  backgroundColor: "#444",
  borderRadius: "0.5em",
  padding: "0.5em",
};

const aiStyles: CSSProperties = {
  marginRight: "auto",
  textAlign: "left",
  maxWidth: "70%",
  fontSize,
  wordBreak: "break-all",
  backgroundColor: "#656565",
  borderRadius: "0.5em",
  padding: "0.5em",
};
