type ParsedTag = {
  id: string;
  text: string;
};

type SummarizedTag = {
  id: string;
  summary: string;
};

type Definition = {
  word: string;
  def: string;
};

type ServerResponse = {
  summary: SummarizedTag[];
  definitions: Definition[];
};

export default class Parser {
  private serverUrl = "http://127.0.0.1:5000";
  private summarizedTags: SummarizedTag[] = [];
  private definitions: Definition[] = [];

  constructor() {
    this.parseHtml();
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
