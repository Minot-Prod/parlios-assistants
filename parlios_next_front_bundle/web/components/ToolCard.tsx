import Link from "next/link";
import { type Tool } from "../lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ margin: 0 }}>{tool.name}</h3>
        <span style={{ fontSize: 12, opacity: 0.7 }}>{tool.enabled === false ? "disabled" : "enabled"}</span>
      </div>
      {tool.description ? <p style={{ marginTop: 8 }}>{tool.description}</p> : null}
      {Array.isArray(tool.tags) && tool.tags.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tool.tags.map((t) => (
            <span key={t} style={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 999, padding: "2px 8px" }}>{t}</span>
          ))}
        </div>
      ) : null}
      <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
        <Link href={`/tools/${tool.slug}`} style={{ textDecoration: "underline" }}>Voir</Link>
        {tool.url ? <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Ouvrir l’outil</a> : null}
      </div>
    </div>
  );
}
