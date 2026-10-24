import { useState } from "react";
import { ELASTICSEARCH_ENDPOINT, TECHNIQUES } from "../constants";

const AUDIT_KEY_BY_TECHNIQUE = {
  T1059: "process_exec",
  T1033: "identity_modification",
};

export default function TechniqueDetail({ techniqueId }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const technique = TECHNIQUES.find((item) => item.id === techniqueId);

  const runQuery = async () => {
    if (!technique) {
      return;
    }
    setLoading(true);
    setError(null);
    const auditKey = AUDIT_KEY_BY_TECHNIQUE[techniqueId] || techniqueId;
    try {
      const response = await fetch(
        `${ELASTICSEARCH_ENDPOINT}/_search?q=${encodeURIComponent(`audit.key: ${auditKey}`)}&size=20`,
      );
      if (!response.ok) {
        throw new Error(`Technique query responded with status ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Technique Detail</h2>
      {technique && (
        <>
          <p>
            {technique.id} — {technique.name}
          </p>
          <p>{technique.description}</p>
          <button type="button" onClick={runQuery}>
            Run Technique Query
          </button>
        </>
      )}
      {loading && <p>Running technique query...</p>}
      {error && <p className="error">{error}</p>}
      {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </section>
  );
}
