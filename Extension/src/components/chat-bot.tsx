import React, { CSSProperties, useState } from "react";
import { fontSize, Message } from "../util/types";

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
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "6em",
        gap: "0.5em",
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
          gap: "0.25em",
        }}
      >
        <textarea
          placeholder="Ask me questions about the text"
          style={{ width: "100%", resize: "none", fontSize }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          disabled={isLoading}
          onClick={handleSend}
          style={{ width: "100%" }}
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
