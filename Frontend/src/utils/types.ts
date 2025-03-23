export type ParsedTag = {
  id: string;
  text: string;
};

export type ProcessedTag = {
  id: string;
  summary: string;
  definitions: {
    word: string;
    def: string;
  }[];
};

export type ServerResponse = ProcessedTag[];
