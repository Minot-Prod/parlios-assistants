import { notFound } from "next/navigation";
import Link from "next/link";
import { findTool, type Tool } from "../../../lib/tools";

export const revalidate = 60; // ISR

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }) {
  const tool = await findTool(params.slug);
  if (!tool) {
    return { title: "Outil introuvable • Parlios" };
  }
  return {
    title: `${tool.name} • Parlios`,
    description: tool.description || "Outil IA Parlios",
  };
}

export default async function ToolDetail({ params }: { params: Params }) {
  const tool: Tool | undefined = await findTool(params.slug);
  if (!tool || tool.enabled === false) {
    notFound();
  }
  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: "0 16px" }}>
      <p style={{ margin: 0 }}><Link href="/tools">← Retour au catalogue</Link></p>
      <h1 style={{ marginTop: 8 }}>{tool.name}</h1>
      {tool.description ? <p style={{ opacity: 0.8 }}>{tool.description}</p> : null}
      {Array.isArray(tool.tags) && tool.tags.length > 0 ? (
        <p style={{ fontSize: 14, opacity: 0.7 }}>Tags : {tool.tags.join(", ")}</p>
      ) : null}
      <div style={{ marginTop: 12 }}>
        {tool.url ? (
          <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
            Ouvrir l’outil
          </a>
        ) : (
          <em>Lien externe non fourni.</em>
        )}
      </div>
    </main>
  );
}
