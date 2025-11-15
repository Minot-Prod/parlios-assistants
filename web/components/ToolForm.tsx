"use client";
import { useState } from "react";

type Props = {
  title: string;
  placeholder: string;
  endpoint: string;
  buttonLabel?: string;
  extraFields?: React.ReactNode;
};

export default function ToolForm({
  title,
  placeholder,
  endpoint,
  buttonLabel = "GÃƒÂ©nÃƒÂ©rer",
  extraFields
}: Props) {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("LinkedIn");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ã¢ÂÂ³ En attente");
  const [output, setOutput] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Ã¢ÂÂ³ GÃƒÂ©nÃƒÂ©ration...");
    setOutput("");
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone })
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Erreur serveur");

      const text = (j.output || j.bio || j.summary || "") as string;
      const actions =
        Array.isArray(j.actions) && j.actions.length
          ? "\n\nActions:\n- " + (j.actions as string[]).join("\n- ")
          : "";

      setOutput(text + actions);
      setStatus("Ã¢Å“â€¦ PrÃƒÂªt");
    } catch (e: any) {
      setStatus("Ã¢ÂÅ’ " + (e?.message || "Erreur"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{title}</h3>
      <form className="form" onSubmit={onSubmit}>
        <textarea
          className="input"
          rows={5}
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <input
            className="input"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
          {extraFields}
          <button className="button" disabled={loading}>{buttonLabel}</button>
        </div>
      </form>
      <div className="status" style={{ marginTop: 10 }}>{status}</div>
      {!!output && <div className="output" style={{ marginTop: 10 }}>{output}</div>}
    </div>
  );
}

