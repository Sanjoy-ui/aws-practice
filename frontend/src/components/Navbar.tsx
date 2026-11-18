import React from 'react';
import { HealthStatus } from '../types/item';
import { Server, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface NavbarProps {
  health: HealthStatus | null;
  loadingHealth: boolean;
  onRefreshHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, loadingHealth, onRefreshHealth }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
  const docsUrl = apiUrl ? `${apiUrl}/docs` : '/docs';

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">⚡</div>
          <div>
            <h1 className="brand-title">FastAPI + React App</h1>
            <p className="brand-subtitle">Full-Stack MVC CRUD Platform</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Health indicator */}
          <div
            className={`health-badge ${
              health?.status === 'healthy' ? 'healthy' : health ? 'degraded' : 'checking'
            }`}
            onClick={onRefreshHealth}
            title="Click to recheck backend connection"
          >
            <div className="status-dot" />
            {loadingHealth ? (
              <span>Checking...</span>
            ) : health ? (
              <span className="health-details">
                {health.status === 'healthy' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                <strong>{health.status}</strong> ({health.database_type})
              </span>
            ) : (
              <span className="health-details">
                <AlertTriangle size={14} /> Offline
              </span>
            )}
          </div>

          <a
            href={docsUrl}
            target="_blank"
            rel="noreferrer"
            className="docs-link-btn"
            title="Open Swagger OpenAPI Documentation"
          >
            <Server size={15} />
            <span>API Docs</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </header>
  );
};

