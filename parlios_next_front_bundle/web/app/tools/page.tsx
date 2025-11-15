import Link from "next/link";
import ToolCard from "../../components/ToolCard";
import { loadTools, type Tool } from "../../lib/tools";

export const revalidate = 60; // ISR

export const metadata = {
  title: "Parlios • Outils IA",
  description: "Catalogue des outils IA gratuits de l’écosystème Parlios.",
};

export default async function ToolsPage() {
  const tools: Tool[] = (await loadTools()).filter(t => t.enabled !== false);
  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 8 }}>Outils IA Parlios</h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>
        Découvrez tous les outils gratuits. Mises à jour automatiques grâce à ISR (60s).
      </p>
      <div style={{ marginTop: 24 }}>
        {tools.length === 0 ? (
          <p>Aucun outil actif pour le moment.</p>
        ) : (
          tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)
        )}
      </div>
      <p style={{ marginTop: 24, fontSize: 12, opacity: 0.6 }}>
        Santé du service : <Link href="/api/health">/api/health</Link>
      </p>
    </main>
  );
}
