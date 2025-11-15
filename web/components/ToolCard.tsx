type Props = { title: string; description: string; href: string };
export default function ToolCard({ title, description, href }: Props) {
  return (
    <a href={href} className="card" style={{ display: "block" }}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="status">Cliquer pour ouvrir ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢</div>
    </a>
  );
}

