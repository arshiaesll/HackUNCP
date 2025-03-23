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
    <>
      <div
        dangerouslySetInnerHTML={{ __html: innerHtml }}
        style={{ scale: "0.75", translate: "-12.5% -12.5%" }}
      />
      <Sidebar />
    </>
  );
}

function Sidebar() {
  const [processed, setProcessed] = useState<ProcessedParagraph[]>([]);
  const [shown, setShown] = useState<ProcessedParagraph[]>([]);

  async function fetchParagraphs() {
    try {
      console.log(pTags);
      const res = await fetch("http://127.0.0.1:5002", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paragraphs: pTags }),
      });
      const data = await res.json();
      setProcessed(data.output_dict);
      console.log(data);
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
      const paragraphs = document.querySelectorAll(tagType);
      for (const p of paragraphs) {
        // if p is in viewport
        if (
          p.getBoundingClientRect().top < window.innerHeight &&
          p.getBoundingClientRect().bottom > 0
        ) {
          const associated = processed.find((pr) => pr.id === p.id);
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
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "25%",
      }}
    >
      {shown.map((p) => (
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
