import { readFileSync } from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export default function Page() {
  const html = readFileSync(path.join(process.cwd(), "public", "parlios_home.html"), "utf8");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

