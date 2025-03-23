import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import parseHtml, { tagType } from "./util/parser";
import { ProcessedParagraph } from "./util/types";

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
  const [processed, setProcessed] = useState<ProcessedParagraph[]>([]);
  const [shown, setShown] = useState<ProcessedParagraph[]>([]);

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

  useEffect(() => {
    function checkParagraphsInView() {
      const paragraphs = document.querySelectorAll(tagType);
      const visible: ProcessedParagraph[] = [];

      paragraphs.forEach((p) => {
        const rect = p.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const associated = processed.find((pr) => pr.id === p.id);
          if (associated) {
            visible.push(associated);
          }
        }
      });

      setShown(visible);
    }

    window.addEventListener("scroll", checkParagraphsInView);
    checkParagraphsInView();

    return () => {
      window.removeEventListener("scroll", checkParagraphsInView);
    };
  }, [processed]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "25%",
        height: "100%",
        overflowY: "auto",
        background: "white",
        borderLeft: "1px solid #ccc",
        padding: "1rem",
      }}
    >
      <h3>Summaries</h3>
      {shown.map((p) => (
        <p key={p.id} style={{ marginBottom: "1rem" }}>
          {p.summary}
        </p>
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
