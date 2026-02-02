export interface ModelData {
  name: string;
  displayName: string;
  color: string;
  data: number[];
  isMain?: boolean;
}

export const performanceData: ModelData[] = [
  {
    name: "grithopper",
    displayName: "GRITHopper-7B (ours)",
    color: "#3b82f6",
    data: [76.98, 55.92, 27.89, 18.59],
    isMain: true,
  },
  {
    name: "gritlm",
    displayName: "GRITLM-7B (Muennighoff et al., 2024)",
    color: "#8b5cf6",
    data: [78.23, 27.23, 4.85, 2.51],
  },
  {
    name: "beamretriever",
    displayName: "BeamRetriever (Zhang et al., NAACL 2024)",
    color: "#ec4899",
    data: [43.24, 13.13, 5.95, 2.76],
  },
  {
    name: "gpt4o",
    displayName: "GPT-4o + GRITLM (decomposition-based)",
    color: "#10b981",
    data: [67.23, 47.27, 19.81, 8.54],
  },
  {
    name: "qwen",
    displayName: "Qwen2.5-32B + GRITLM (decomposition-based)",
    color: "#f59e0b",
    data: [53.30, 29.53, 11.31, 6.78],
  },
];

export const hopLabels = ["Hop 1", "Hop 2", "Hop 3", "Hop 4"];

export const exampleQuery = "Where does the body of water by the city that shares a border with Elizabeth Berg's birthplace and Ohio River meet?";

export const examplePassages = [
  {
    id: 1,
    title: "Elizabeth Berg",
    snippet: "Elizabeth Berg was born in Saint Paul, Minnesota...",
  },
  {
    id: 2,
    title: "Saint Paul Geography",
    snippet: "Saint Paul shares a border with Minneapolis, located along the Mississippi River...",
  },
  {
    id: 3,
    title: "Minneapolis Rivers",
    snippet: "The Mississippi River flows through Minneapolis and continues south...",
  },
  {
    id: 4,
    title: "River Confluence",
    snippet: "The Mississippi River meets the Ohio River at Cairo, Illinois...",
  },
];
