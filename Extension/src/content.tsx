import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import parseHtml from "./util/parser";
import { ProcessedParagraph } from "./util/types";

const pTags = parseHtml();

function App() {
  const [processed, setProcessed] = useState<ProcessedParagraph[]>([]);

  async function fetchParagraphs() {
    try {
      const res = await fetch("http://127.0.0.1:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paragraphs: pTags,
        }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchParagraphs();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        padding: "20px",
        backgroundColor: "#282c34",
        color: "white",
        borderRadius: "8px",
        zIndex: 9999,
      }}
    >
      🎉 Hello from React!
    </div>
  );
}

// Create container in the page
const rootContainer = document.createElement("div");
document.body.appendChild(rootContainer);

// Render the app
const root = createRoot(rootContainer);
root.render(<App />);
