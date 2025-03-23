import React, { RefObject, useEffect, useRef, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ display: "flex" }}>
      <div
        ref={scrollRef}
        style={{
          width: "75%",
          marginRight: "25%",
          overflowY: "auto",
          height: "100vh",
        }}
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
      <Sidebar scrollRef={scrollRef} />
    </div>
  );
}

type SidebarProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
};

function Sidebar({ scrollRef }: SidebarProps) {
  const [convoId, _] = useState(crypto.randomUUID());
  const [mode, setMode] = useState<"summary" | "chat">("chat");
  const [processed, setProcessed] = useState<ProcessedParagraph[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchParagraphs() {
    try {
      setIsLoading(true);
      const res = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paragraphs: pTags }),
      });
      const data = await res.json();
      setProcessed(data.output_dict);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchParagraphs();
  }, []);

  async function fetchChat(message: string) {
    try {
      console.log(document.body.innerText);
      const res = await fetch(`${serverUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: document.body.innerText,
          user_input: message,
          conversation_id: convoId,
        }),
      });
      const data = await res.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, role: "user" },
        { text: data.output_dict, role: "ai" },
      ]);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    }
  }

  // if (isLoading) {
  //   return (
  //     <div
  //       style={{
  //         backgroundColor: "#111",
  //         position: "fixed",
  //         top: 0,
  //         right: 0,
  //         width: "25%",
  //         height: "100vh",
  //         overflowY: "auto",
  //         borderLeft: "2px solid #888",
  //         padding: "0.5em",
  //         display: "grid",
  //         placeItems: "center",
  //       }}
  //     >
  //       <p style={{ color: "#eee" }}>Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <div
      style={{
        backgroundColor: "#111",
        position: "fixed",
        top: 0,
        right: 0,
        width: "25%",
        height: "100vh",
        overflowY: "hidden",
        borderLeft: "2px solid #888",
        padding: "0.5em",
      }}
    >
      <div style={{ display: "flex", gap: "0.5em", marginBottom: "1em" }}>
        <button
          onClick={() => setMode("chat")}
          style={{
            flex: 1,
            paddingBlock: "1em",
            backgroundColor: mode === "chat" ? "#222" : "#333",
            border: "none",
            outline: "none",
            borderRadius: "0.5em",
            cursor: "pointer",
            fontWeight: 600,
            color: "#eee",
          }}
        >
          Chat
        </button>
        <button
          onClick={() => setMode("summary")}
          style={{
            flex: 1,
            paddingBlock: "1em",
            backgroundColor: mode === "summary" ? "#222" : "#333",
            border: "none",
            outline: "none",
            borderRadius: "0.5em",
            cursor: "pointer",
            fontWeight: 600,
            color: "#eee",
          }}
        >
          Summarize
        </button>
      </div>
      {mode === "summary" && (
        <Summary scrollRef={scrollRef} paragraphs={processed} />
      )}
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
