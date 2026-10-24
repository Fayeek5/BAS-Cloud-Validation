import { useEffect, useState } from "react";

const ELASTICSEARCH_ENDPOINT = "/api";

const LICENSE_TEXT = `MIT License

Copyright (c) 2026 Fayeek5

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

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
      <section className="license-card">
        <h2>License</h2>
        <p>MIT License</p>
        <p>Copyright (c) 2026 Fayeek5</p>
        <pre>{LICENSE_TEXT}</pre>
      </section>
    </main>
  );
}
