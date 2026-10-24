import { useState } from "react";
import { ELASTICSEARCH_ENDPOINT } from "../constants";

export default function LogViewer() {
  const [query, setQuery] = useState("audit.key: process_exec");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${ELASTICSEARCH_ENDPOINT}/_search?q=${encodeURIComponent(query)}&size=10`,
      );
      if (!response.ok) {
        throw new Error(`Search responded with status ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const listIndices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ELASTICSEARCH_ENDPOINT}/_cat/indices?v`);
      if (!response.ok) {
        throw new Error(`Index lookup responded with status ${response.status}`);
      }
      const data = await response.json();
      setResults({ indices: data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Log Explorer</h2>
      <div className="log-controls">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="KQL or Elasticsearch query"
        />
        <button type="button" onClick={runQuery}>
          Run Query
        </button>
        <button type="button" onClick={listIndices}>
          List Indices
        </button>
      </div>
      {loading && <p>Querying Elasticsearch...</p>}
      {error && <p className="error">{error}</p>}
      {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </section>
  );
}
