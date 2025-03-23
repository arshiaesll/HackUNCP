import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import parseHtml from "./util/parser";
import { ProcessedParagraph } from "./util/types";

const pTags = parseHtml();

type PageBodyProps = {
  innerHtml: string;
};

function PageBody({ innerHtml }: PageBodyProps) {
  return (
    <body style={{ display: "grid", gridTemplateColumns: "3fr 1fr" }}>
      <div dangerouslySetInnerHTML={{ __html: innerHtml }} />
      <Sidebar />
    </body>
  );
}

function Sidebar() {
  const [processed, setProcessed] = useState<ProcessedParagraph[]>([]);
  const [shown, setShown] = useState<ProcessedParagraph[]>([]);

  async function fetchParagraphs() {
    try {
      const res = await fetch("http://127.0.0.1:5002", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paragraphs: pTags,
        }),
      });
      const data = await res.json();
      setProcessed(data.output_dict);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchParagraphs();
  }, []);

  useEffect(() => {
    function checkParagraphs() {
      let inViewport: ProcessedParagraph[] = [];
      const paragraphs = document.querySelectorAll("p");
      for (const p of paragraphs) {
        // if p is in viewport
        if (p.getBoundingClientRect().top < window.innerHeight) {
          const associated = processed.find((pr) => pr.id === p.id);
          console.log(processed);
          console.log(associated, p.id);
          if (associated) {
            inViewport.push(associated);
          }
        }
      }
      setShown(inViewport);
    }

    document.addEventListener("scroll", checkParagraphs);
    return () => document.removeEventListener("scroll", checkParagraphs);
  }, [processed]);

  return (
    <div>
      <p>Sidebar</p>
      {shown.map((p) => (
        <p key={p.id}>{p.summary}</p>
      ))}
    </div>
  );
}

// Create container in the page

const html = document.querySelector("html")!;
const body = document.querySelector("body")!;
const innerHtml = body.outerHTML;
html.innerHTML = "";

const root = createRoot(html);
root.render(<PageBody innerHtml={innerHtml} />);
