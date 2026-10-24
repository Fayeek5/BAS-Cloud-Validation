import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

const OverviewPanel = lazy(() => import("./components/OverviewPanel"));
const DetectionCoverage = lazy(() => import("./components/DetectionCoverage"));
const TechniqueDetail = lazy(() => import("./components/TechniqueDetail"));
const LogViewer = lazy(() => import("./components/LogViewer"));
const ArtLauncher = lazy(() => import("./components/ArtLauncher"));
const LiveEvents = lazy(() => import("./components/LiveEvents"));
const ParticleField = lazy(() => import("./components/ParticleField"));
const ScanReticle = lazy(() => import("./components/ScanReticle"));

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
      <ParticleField />
      <ScanReticle />
      <header className="dashboard-header">
        <h1>BAS Cloud Validation</h1>
        <p>Local Breach and Attack Simulation control validation dashboard</p>
      </header>
      <OverviewPanel health={health} loading={loading} error={error} />
      <Suspense fallback={<div className="panel-fallback">Loading telemetry…</div>}>
        <DetectionCoverage />
      </Suspense>
      <Suspense fallback={<div className="panel-fallback">Loading technique…</div>}>
        <TechniqueDetail techniqueId="T1059" />
      </Suspense>
      <Suspense fallback={<div className="panel-fallback">Loading logs…</div>}>
        <LogViewer />
      </Suspense>
      <Suspense fallback={<div className="panel-fallback">Loading launcher…</div>}>
        <ArtLauncher />
      </Suspense>
      <Suspense fallback={<div className="panel-fallback">Loading events…</div>}>
        <LiveEvents />
      </Suspense>
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
