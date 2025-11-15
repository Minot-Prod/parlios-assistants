import path from "node:path";
import { promises as fs } from "node:fs";

export type Tool = {
  slug: string;
  name: string;
  description?: string;
  tags?: string[];
  url?: string;
  enabled?: boolean;
};

export async function loadTools(): Promise<Tool[]> {
  const filePath = path.join(process.cwd(), "data", "tools.registry.json");
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  // Accept either an array or an object with a "tools" array
  const tools: Tool[] = Array.isArray(parsed) ? parsed : Array.isArray(parsed.tools) ? parsed.tools : [];
  return tools;
}

export async function findTool(slug: string): Promise<Tool | undefined> {
  const tools = await loadTools();
  return tools.find(t => t.slug === slug);
}
