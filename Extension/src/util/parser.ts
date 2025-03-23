import { RawParagraph } from "./types";

export default function parseHtml() {
  const tags = document.querySelectorAll("p");
  let parsed: RawParagraph[] = [];
  for (const tag of tags) {
    const id = crypto.randomUUID();
    tag.id = id;
    parsed.push({
      id,
      text: tag.textContent || "",
    });
  }
  return parsed;
}
