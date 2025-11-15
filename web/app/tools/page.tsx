import ToolCard from "../../components/ToolCard";
import { TOOLS } from "../../lib/config";

export default function ToolsIndex() {
  return (
    <section className="card" style={{ padding: 18 }}>
      <h2>Outils IA</h2>
      <div className="grid" style={{ marginTop: 12 }}>
        {TOOLS.length === 0 ? (
          <p>Aucun outil actif pour le moment.</p>
        ) : (
          TOOLS.map((t) => (
            <ToolCard
              key={t.slug}
              title={t.name}
              description={t.description}
              href={`/tools/${t.slug}/`}
            />
          ))
        )}
      </div>
      <p style={{ marginTop: 24, fontSize: 12, opacity: 0.6 }}>
        Tu veux en voir plus ? Ping et on ajoute des mini-outils en continu.
      </p>
    </section>
  );
}


