import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import octofitLogo from '../../../docs/octofitapp-small.png'
import './App.css'

function Overview({ serviceStatus }) {
  return (
    <main className="container-fluid workspace-main">
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">PERSONAL WORKSPACE</p>
          <h1>Overview</h1>
        </div>
        <p className="workspace-date">OCTOFIT TRACKER</p>
      </div>

      <section className="status-panel" aria-labelledby="status-heading">
        <div className="status-intro">
          <p className="eyebrow">SYSTEM STATUS</p>
          <h2 id="status-heading">Application services</h2>
          <p className="status-caption">Live connection check for the OctoFit stack.</p>
        </div>
        <div className="service-list" aria-live="polite">
          <div className="service-row">
            <span className="service-name"><span className="service-mark api-mark" />API</span>
            <span className={`service-state state-${serviceStatus.api}`}>
              {serviceStatus.api}
            </span>
          </div>
          <div className="service-row">
            <span className="service-name"><span className="service-mark database-mark" />MongoDB</span>
            <span className={`service-state state-${serviceStatus.database}`}>
              {serviceStatus.database}
            </span>
          </div>
        </div>
      </section>

      <section className="runtime-panel" aria-labelledby="runtime-heading">
        <div>
          <p className="eyebrow">RUNTIME</p>
          <h2 id="runtime-heading">Three services, one workspace</h2>
          <p className="status-caption">The local development ports are reserved for each application tier.</p>
        </div>
        <div className="runtime-list">
          <div className="runtime-row"><span>Presentation</span><code>5173</code></div>
          <div className="runtime-row"><span>API</span><code>8000</code></div>
          <div className="runtime-row"><span>MongoDB</span><code>27017</code></div>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [serviceStatus, setServiceStatus] = useState({
    api: 'checking',
    database: 'checking',
  })

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/health', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API request failed')
        return response.json()
      })
      .then((health) => {
        setServiceStatus({ api: health.status, database: health.database })
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setServiceStatus({ api: 'unavailable', database: 'unavailable' })
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="/" aria-label="OctoFit Tracker home">
          <img src={octofitLogo} alt="" />
          <span>OCTOFIT <strong>TRACKER</strong></span>
        </a>
        <nav aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Overview
          </NavLink>
        </nav>
        <span className="header-label">TRAINING WORKSPACE</span>
      </header>
      <Routes>
        <Route path="/" element={<Overview serviceStatus={serviceStatus} />} />
        <Route path="*" element={<Overview serviceStatus={serviceStatus} />} />
      </Routes>
      <footer className="app-footer">
        <span>OCTOFIT TRACKER</span>
        <span>MOVE WITH INTENTION</span>
      </footer>
    </div>
  )
}

export default App
