import { useEffect, useState } from "react";

const ELASTICSEARCH_ENDPOINT = "http://localhost:9200";

export default function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${ELASTICSEARCH_ENDPOINT}/_cluster/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Elasticsearch responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setHealth(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>BAS Control Validation</h1>
        <p>Local Breach and Attack Simulation control validation dashboard</p>
      </header>
      <section className="status-card">
        <h2>Elasticsearch Cluster Health</h2>
        {loading && <p>Checking cluster status...</p>}
        {error && <p className="error">Unable to reach Elasticsearch: {error}</p>}
        {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      </section>
    </main>
  );
}
