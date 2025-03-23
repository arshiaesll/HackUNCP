import { RawParagraph } from "./types";

export default function parseHtml() {
  const tags = document.querySelectorAll("p");
  let parsed: RawParagraph[] = [];
  for (let i = 0; i < tags.length; ++i) {
    tags[i].id = `${i}`;
    parsed.push({
      id: `${i}`,
      text: tags[i].textContent || "",
    });
  }
  console.log(tags);
  return parsed;
}
