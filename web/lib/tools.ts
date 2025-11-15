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

function stripBom(s: string) {
  return s.replace(/^\uFEFF/, "");
}

export async function loadTools(): Promise<Tool[]> {
  const filePath = path.join(process.cwd(), "data", "tools.registry.json");
  const raw = await fs.readFile(filePath, "utf8");
  const clean = stripBom(raw);
  const parsed = JSON.parse(clean);
  const tools: Tool[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as any).tools)
    ? (parsed as any).tools
    : [];
  return tools;
}

export async function findTool(slug: string): Promise<Tool | undefined> {
  const tools = await loadTools();
  return tools.find((t) => t.slug === slug);
}


