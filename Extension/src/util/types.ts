export type RawParagraph = {
  id: string;
  text: string;
};

export type ProcessedParagraph = {
  id: string;
  summary: string;
  definitions?: {
    word: string;
    def: string;
  }[];
};

export type Message = {
  text: string;
  role: "user" | "ai";
};
