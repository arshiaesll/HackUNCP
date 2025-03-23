import { RawParagraph } from "./types";

export const tagType = "p";

export default function parseHtml() {
  const tags = document.querySelectorAll(tagType);
  let parsed: RawParagraph[] = [];
  for (let i = 0; i < tags.length; ++i) {
    tags[i].id = `${i}`;
    parsed.push({
      id: `${i}`,
      text: tags[i].textContent || "",
    });
  }
  return parsed;
}
