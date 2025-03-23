export type ParsedTag = {
  id: string;
  text: string;
};

export type SummarizedTag = {
  id: string;
  summary: string;
};

export type Definition = {
  word: string;
  def: string;
};

export type ServerResponse = {
  summary: SummarizedTag[];
  definitions: Definition[];
};
