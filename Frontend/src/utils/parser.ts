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
  private readonly serverUrl = "http://127.0.0.1:5000";
  private summarizedTags: SummarizedTag[] = [];
  private definitions: Definition[] = [];

  private paragraphs: HTMLElement[] = [];

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
      this.paragraphs.push(p);
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
    // put document.body children into pageContent
    while (document.body.firstChild) {
      pageContent.appendChild(document.body.firstChild);
    }
    const html = document.querySelector("html")!;
    html.appendChild(newBody);
    // html.replaceChild(newBody, document.body);
  }

  private async summarizeText(parsedTags: ParsedTag[]) {
    const res = await fetch(this.serverUrl, {
      method: "POST",
      body: JSON.stringify(parsedTags),
    });
    const data = (await res.json()) as ServerResponse;
    this.summarizedTags = data.summary;
    this.definitions = data.definitions;

    this.updateSidebar();
  }

  private onScroll = () => {
    this.updateSidebar();
  };

  private updateSidebar() {
    if (!this.sidebar) return;

    this.sidebar.innerHTML = "";

    this.sidebar.style.position = "relative";

    this.paragraphs.forEach((p) => {
      if (!this.isElementVisible(p)) {
        return; // skip paragraphs not in view
      }

      // find the matching summary text by ID?
      const summaryObj = this.summarizedTags.find((s) => s.id === p.id);
      if (!summaryObj) return;

      // get the paragraph’s offset from the top
      const rect = p.getBoundingClientRect();
      const paragraphTop = rect.top;

      //ceate element to hold summary
      const summaryDiv = document.createElement("div");
      summaryDiv.textContent = summaryObj.summary;
      summaryDiv.style.position = "absolute";
      summaryDiv.style.top = `${paragraphTop}px`;
      summaryDiv.style.left = "0px";
      summaryDiv.style.width = "95%"; // so it fits in the sidebar’s column

      //styling for it
      summaryDiv.style.padding = "0.5rem";
      summaryDiv.style.marginBottom = "1rem";
      summaryDiv.style.border = "1px solid #ccc";
      // Append to the sidebar
      this.sidebar!.appendChild(summaryDiv);
    });
  }
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
