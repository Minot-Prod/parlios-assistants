import { readFileSync } from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export default function ExplorerPage() {
  const html = readFileSync(path.join(process.cwd(), "public", "explorer.html"), "utf8");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

