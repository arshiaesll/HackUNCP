import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import parseHtml from "./util/parser";
import { ProcessedParagraph } from "./util/types";

type PageBodyProps = {
  innerHtml: string;
};
function PageBody({ innerHtml }: PageBodyProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr" }}>
      <div dangerouslySetInnerHTML={{ __html: innerHtml }} />
      <Sidebar />
    </div>
  );
}

function Sidebar() {
  const [processed, setProcessed] = useState<ProcessedParagraph[]>([]);
  const pTags = parseHtml();

  async function fetchParagraphs() {
    try {
      const res = await fetch("http://127.0.0.1:5002", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paragraphs: pTags }),
      });
      const data = await res.json();
      setProcessed(data.output_dict);
      console.log("Received data:", data);
    } catch (error) {
      console.error(error);
    }
  }

  function checkParagraphs() {
    const paragraphs = document.querySelectorAll("p");
    for (const p of paragraphs) {
      const rect = p.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        (p as HTMLElement).style.backgroundColor = "yellow";
      } else {
        (p as HTMLElement).style.backgroundColor = "";
      }
    }
  }

  useEffect(() => {
    fetchParagraphs();

    document.addEventListener("scroll", checkParagraphs);
    return () => document.removeEventListener("scroll", checkParagraphs);
  }, []);

  return (
    <div>
      <h3>Sidebar</h3>
      {processed.map((p) => (
        <p key={p.id}>{p.summary}</p>
      ))}
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
