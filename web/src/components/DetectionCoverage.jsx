import { useState } from "react";
import { ELASTICSEARCH_ENDPOINT, TECHNIQUES } from "../constants";

const AUDIT_KEY_BY_TECHNIQUE = {
  T1059: "process_exec",
  T1033: "identity_modification",
};

export default function DetectionCoverage() {
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runCoverageCheck = async () => {
    setLoading(true);
    setError(null);
    const results = [];
    for (const technique of TECHNIQUES) {
      const auditKey = AUDIT_KEY_BY_TECHNIQUE[technique.id] || technique.id;
      try {
        const response = await fetch(
          `${ELASTICSEARCH_ENDPOINT}/_search?q=${encodeURIComponent(`audit.key: ${auditKey}`)}&size=1`,
        );
        if (!response.ok) {
          throw new Error(`Query failed for ${technique.id}`);
        }
        const data = await response.json();
        const hits = (data.hits && data.hits.hits) || [];
        results.push({
          technique: technique.id,
          auditKey,
          captured: hits.length > 0,
        });
      } catch (err) {
        results.push({
          technique: technique.id,
          auditKey,
          captured: false,
          error: err.message,
        });
      }
    }
    setCoverage(results);
    setLoading(false);
  };

  return (
    <section className="panel">
      <h2>Detection Coverage</h2>
      <p>Map simulated techniques to audit rules and verify telemetry capture.</p>
      <div className="art-controls">
        <button type="button" onClick={runCoverageCheck}>
          Run Coverage Check
        </button>
      </div>
      {loading && <p>Checking coverage...</p>}
      {error && <p className="error">{error}</p>}
      {coverage.length > 0 && (
        <ul className="coverage-list">
          {coverage.map((item) => (
            <li key={item.technique} className="coverage-item">
              <span className="technique-id">{item.technique}</span>
              <span className="technique-name">{item.auditKey}</span>
              <span
                className={`technique-state ${item.captured ? "coverage-hit" : "coverage-miss"}`}
              >
                {item.captured ? "Captured" : "Not Captured"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
