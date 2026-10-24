import { useEffect, useState } from "react";
import { ELASTICSEARCH_ENDPOINT } from "../constants";

export default function LiveEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${ELASTICSEARCH_ENDPOINT}/_search?q=match_all&size=20`);
        if (!response.ok) {
          throw new Error(`Event query responded with status ${response.status}`);
        }
        const data = await response.json();
        const hits = (data.hits && data.hits.hits) || [];
        setEvents(hits.map((hit) => hit._source).filter(Boolean));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="panel">
      <h2>Live Event Stream</h2>
      <p>Streaming recent events from Elasticsearch every 10 seconds.</p>
      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="event-list">
        {events.map((event, index) => (
          <li key={index} className="event-item">
            {JSON.stringify(event)}
          </li>
        ))}
      </ul>
    </section>
  );
}
