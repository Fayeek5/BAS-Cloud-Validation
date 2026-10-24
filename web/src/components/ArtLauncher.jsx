import { useState } from "react";
import { TECHNIQUES } from "../constants";

export default function ArtLauncher() {
  const [technique, setTechnique] = useState(TECHNIQUES[0].id);
  const [status, setStatus] = useState(null);

  const launch = () => {
    setStatus(`Dispatching atomic test ${technique} against security-target-endpoint...`);
    setStatus(`Atomic test ${technique} queued for execution on the isolated target.`);
  };

  return (
    <section className="panel">
      <h2>Atomic Red Team Launcher</h2>
      <div className="art-controls">
        <select value={technique} onChange={(event) => setTechnique(event.target.value)}>
          {TECHNIQUES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={launch}>
          Launch Atomic Test
        </button>
      </div>
      {status && <p className="art-status">{status}</p>}
    </section>
  );
}
