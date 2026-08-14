export interface NodeData {
  id: string;
  name: string;
  aliases: string[];
  software: string;
  context: string;
  category: string;
  inputs: number;
  outputs: number;
  color_hex: string;
  frequency_tier: number;
}
