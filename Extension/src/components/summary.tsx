import React, { useEffect, useState } from "react";
import { ProcessedParagraph } from "../util/types";
import { tagType } from "../util/parser";

type SummaryProps = {
  paragraphs: ProcessedParagraph[];
};

export default function Summary({ paragraphs }: SummaryProps) {
  const [shown, setShown] = useState<ProcessedParagraph[]>([]);


  function highlightParagraph(id: string){
    const paragraphEl = document.getElementById(id);
    if (paragraphEl) {
      paragraphEl.style.backgroundColor = "yellow";
    }
  }

  function removeHighlight(id: string) {
    const paragraphEl = document.getElementById(id);
    if (paragraphEl) {
      paragraphEl.style.backgroundColor = "";
    }
  }

  useEffect(() => {
    function checkParagraphsInView() {
      const ps = document.querySelectorAll(tagType);
      const visible: ProcessedParagraph[] = [];

      ps.forEach((p) => {
        const rect = p.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const associated = paragraphs.find((pa: any) => pa.id === p.id);
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

  return (
    <div>
      {shown.map((p) => (
        <p
          key={p.id}
          style={{ marginBottom: "1rem", cursor: "pointer" }}
          onMouseEnter={() => highlightParagraph(p.id)}
          onMouseLeave={() => removeHighlight(p.id)}
        >
          {p.summary}
        </p>
      ))}
    </div>
  );
}