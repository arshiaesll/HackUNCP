import { SummarizedTag, Definition, ParsedTag, ServerResponse } from "./types";

export default class Parser {
  private readonly serverUrl = "http://127.0.0.1:5000";
  private summarizedTags: SummarizedTag[] = [];
  private definitions: Definition[] = [];
  private sidebar: HTMLElement | null = null;

  constructor() {
    this.parseHtml();
    this.createSidebar();
    document.addEventListener("scroll", this.onScroll);
  }

  private parseHtml() {
    let parsedTags: ParsedTag[] = [];
    document.querySelectorAll("p").forEach((p) => {
      const id = crypto.randomUUID();
      p.id = id;
      parsedTags.push({
        id,
        text: p.textContent || "",
      });
    });
    this.summarizeText(parsedTags);
  }

  private createSidebar() {
    const sidebar = document.createElement("div");
    this.sidebar = sidebar;
    const pageContent = document.createElement("div");
    const newBody = document.createElement("body");
    newBody.style.display = "grid";
    newBody.style.gridTemplateColumns = "3fr 1fr";
    newBody.appendChild(pageContent);
    newBody.appendChild(sidebar);
    while (document.body.firstChild) {
      pageContent.appendChild(document.body.firstChild);
    }
    const html = document.querySelector("html")!;
    const body = document.querySelector("body")!;
    html.removeChild(body);
    html.appendChild(newBody);
  }

  private async summarizeText(parsedTags: ParsedTag[]) {
    const res = await fetch(this.serverUrl, {
      method: "POST",
      body: JSON.stringify(parsedTags),
    });
    const data = (await res.json()) as ServerResponse;
    this.summarizedTags = data.summary;
    this.definitions = data.definitions;
  }

  private onScroll() {}

  private isElementVisible(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  logParsedTags() {
    console.log(this.summarizedTags);
    console.log(this.definitions);
  }
}
