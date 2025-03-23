import React, { useEffect, useState } from "react";
import { fontSize, ProcessedParagraph } from "../util/types";
import { tagType } from "../util/parser";

type SummaryProps = {
  paragraphs: ProcessedParagraph[];
};

export default function Summary({ paragraphs }: SummaryProps) {
  const [shown, setShown] = useState<ProcessedParagraph[]>([]);

  function highlightParagraph(id: string) {
    const paragraphEl = document.getElementById(id);
    if (paragraphEl) {
      paragraphEl.style.transition = "all 0.2s ease-in-out";
      paragraphEl.style.color = "#e67e22";
      paragraphEl.style.fontWeight = "bold";
      paragraphEl.style.transform = "scale(1.03)";
      paragraphEl.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.3)";
    }
  }

  function removeHighlight(id: string) {
    const paragraphEl = document.getElementById(id);
    if (paragraphEl) {
      paragraphEl.style.transition = "";
      paragraphEl.style.color = "";
      paragraphEl.style.fontWeight = "";
      paragraphEl.style.transform = "";
      paragraphEl.style.textShadow = "";
    }
  }

  useEffect(() => {
    function checkParagraphsInView() {
      const ps = document.querySelectorAll(tagType);
      const visible: ProcessedParagraph[] = [];

      ps.forEach((p) => {
        const rect = p.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const associated = paragraphs.find((pa) => pa.id === p.id);
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
  }, [paragraphs]);

  function DefinitionSpan({ word, definition }: { word: string; definition: string }) {
    const [hovered, setHovered] = useState(false);

    return (
      <span
        style={{ position: "relative", cursor: "help", display: "inline-block" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {word}
        {hovered && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "0.25rem",
              background: "#fff",
              border: "1px solid #ccc",
              padding: "0.5rem",
              width: "200px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              zIndex: 9999,
            }}
          >
            {definition}
          </div>
        )}
      </span>
    );
  }
  function highlightDefinitions(
    paragraphText: string,
    definitionList?: { word: string; def: string }[]
  ): React.ReactNode {
    if (!definitionList) {
      return paragraphText;
    }
  
    const tokens = paragraphText.split(/\s+/);
  
    return tokens.map((token, i) => {
      const cleaned = token.replace(/[^\w]/g, "").toLowerCase();
      const match = definitionList.find((d) => d.word.toLowerCase() === cleaned);
  
      if (match) {
        return (
          <React.Fragment key={i}>
            <DefinitionSpan
              word={token}
              definition={match.def}
            />{" "}
          </React.Fragment>
        );
      }
      return token + " ";
    });
  }
  

  return (
    <div>
      {shown.map((p) => (
        <p
          key={p.id}
          style={{ marginBottom: "1rem", cursor: "pointer", fontSize }}
          onMouseEnter={() => highlightParagraph(p.id)}
          onMouseLeave={() => removeHighlight(p.id)}
        >
         {highlightDefinitions(p.summary, p.definitions)}
        </p>
      ))}
    </div>
  );
}
