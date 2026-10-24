import { TECHNIQUES } from "../constants";
import GlitchText from "./GlitchText";

export default function OverviewPanel({ health, loading, error }) {
  const status = error ? "unreachable" : health && health.status ? health.status : "unknown";

  return (
    <section className="overview-card">
      <h2>Overview</h2>
      <div className="overview-status">
        <span className={`status-dot status-${status}`} />
        <GlitchText text={`Elasticsearch status: ${status}`} />
      </div>
      <h3>Targeted Techniques</h3>
      <ul className="technique-list">
        {TECHNIQUES.map((technique) => (
          <li key={technique.id} className="technique-item">
            <span className="technique-id">{technique.id}</span>
            <span className="technique-name">{technique.name}</span>
            <span className="technique-state">{technique.state}</span>
          </li>
        ))}
      </ul>
      {health && (
        <div className="overview-health">
          <h3>Cluster Health</h3>
          <pre>{JSON.stringify(health, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
