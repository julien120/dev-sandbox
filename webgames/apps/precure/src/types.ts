export type EmotionNode = {
  id: string;
  value: number;
  color?: string;
  label?: string;
  phrase?: string;
};

export type EmotionLink = {
  source: string;
  target: string;
  weight: number;
};

export type EraGraph = {
  era: string;
  label: string;
  nodes: EmotionNode[];
  links: EmotionLink[];
};
