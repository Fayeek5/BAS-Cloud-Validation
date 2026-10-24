import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import OverviewPanel from "./components/OverviewPanel";
import TechniqueDetail from "./components/TechniqueDetail";
import LogViewer from "./components/LogViewer";
import ArtLauncher from "./components/ArtLauncher";
import LiveEvents from "./components/LiveEvents";

function Dashboard() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const glow = glowRef.current;
      if (!glow) {
        return;
      }
      glow.style.background = `radial-gradient(circle at ${event.clientX}px ${event.clientY}px, rgba(0, 212, 255, 0.10), transparent 60%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    fetch(`${"/api"}/_cluster/health`)
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
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
      <header className="dashboard-header">
        <h1>BAS Control Validation</h1>
        <p>Local Breach and Attack Simulation control validation dashboard</p>
      </header>
      <OverviewPanel health={health} loading={loading} error={error} />
      <TechniqueDetail techniqueId="T1059" />
      <LogViewer />
      <ArtLauncher />
      <LiveEvents />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
