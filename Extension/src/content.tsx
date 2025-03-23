import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import parseHtml from "./util/parser";
import { Message, ProcessedParagraph } from "./util/types";
import Summary from "./components/summary";
import ChatBot from "./components/chat-bot";

const serverUrl = "http://127.0.0.1:5002";

const pTags = parseHtml();

type PageBodyProps = {
  innerHtml: string;
};

function PageBody({ innerHtml }: PageBodyProps) {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "75%",
          marginRight: "25%",
        }}
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
      <Sidebar />
    </div>
  );
}

function Sidebar() {
  const [mode, setMode] = useState<"summary" | "chat">("summary");
  const [processed, setProcessed] = useState<ProcessedParagraph[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  async function fetchParagraphs() {
    try {
      const res = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paragraphs: pTags }),
      });
      const data = await res.json();
      setProcessed(data.output_dict);
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    }
  }

  useEffect(() => {
    fetchParagraphs();
  }, []);

  async function fetchChat(message: string) {
    try {
      // const data = "response";
      const res = await fetch(`${serverUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          paragraphs: pTags.slice(0, 50).map((p) => p.text),
        }),
      });
      const data = await res.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, role: "user" },
        { text: data, role: "ai" },
      ]);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "25%",
        height: "100vh",
        overflowY: "auto",
        borderLeft: "2px solid #aaa",
        padding: "0.5em",
      }}
    >
      <div style={{ display: "flex", gap: "0.5em", marginBottom: "1em" }}>
        <button
          onClick={() => setMode("summary")}
          style={{ flex: 1, paddingBlock: "1em" }}
        >
          Summarize
        </button>
        <button
          onClick={() => setMode("chat")}
          style={{ flex: 1, paddingBlock: "1em" }}
        >
          Chat
        </button>
      </div>
      {mode === "summary" && <Summary paragraphs={processed} />}
      {mode === "chat" && <ChatBot messages={messages} onSend={fetchChat} />}
    </div>
  );
}

const body = document.querySelector("body")!;
const innerHtml = body.innerHTML;
body.innerHTML = "";

const container = document.createElement("div");
body.appendChild(container);

const root = createRoot(container);
root.render(<PageBody innerHtml={innerHtml} />);
