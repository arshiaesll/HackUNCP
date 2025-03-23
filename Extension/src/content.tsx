import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import parseHtml, { tagType } from "./util/parser";
import { Message, ProcessedParagraph } from "./util/types";
import Summary from "./components/summary";
import ChatBot from "./components/chat-bot";

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
      console.log("Parsed pTags:", pTags);
      const res = await fetch("http://127.0.0.1:5002", {
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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "25%",
        height: "100%",
        overflowY: "auto",
        borderLeft: "1px solid #ccc",
        padding: "1rem",
      }}
    >
      <div>
        <button onClick={() => setMode("summary")}>Summarize</button>
        <button onClick={() => setMode("chat")}>Chat</button>
      </div>
      {mode === "summary" && <Summary paragraphs={processed} />}
      {mode === "chat" && <ChatBot messages={messages} />}
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
