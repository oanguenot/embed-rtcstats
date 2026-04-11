import { useEffect, useState } from 'react'
import './App.css'

type Session = {
  title: string
  url: string
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export default function App() {
  const assetBaseUrl = import.meta.env.BASE_URL
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)
  const [activeTitle, setActiveTitle] = useState<string | null>(null)
  /** Bumps on every navigation so the iframe remounts even when `src` is unchanged. */
  const [frameKey, setFrameKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${assetBaseUrl}sessions.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as { sessions?: Session[] }
        const list = Array.isArray(data.sessions) ? data.sessions : []
        if (!cancelled) {
          setSessions(list)
          setLoadError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setSessions([])
          setLoadError(e instanceof Error ? e.message : 'Failed to load sessions')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [assetBaseUrl])

  const selectSession = (session: Session) => {
    const url = normalizeUrl(session.url)
    setActiveTitle(session.title)
    setFrameKey((k) => k + 1)
    setIframeSrc(url || null)
    console.log('[embed-rtcstats] Session', { title: session.title, url: url || null })
  }

  return (
    <div className="app">
      <header className="host-header">
        <div className="host-header-brand">
          <div className="host-header-logo" aria-hidden="true">
            VT
          </div>
          <div className="host-header-text">
            <h1 className="host-header-title">VertexTel Solutions</h1>
            <p className="host-header-tagline">Operations console</p>
          </div>
        </div>
      </header>
      <div className="main-layout">
        <aside className="session-sidebar" aria-label="Sessions">
          <nav className="sidebar-menu" aria-label="Call Analysis">
            <span className="sidebar-menu-title">
              Call Analysis 
            </span>
            <img
              src={`${assetBaseUrl}icon.png`}
              alt=""
              className="sidebar-menu-logo"
              width={48}
              height={48}
            />
          </nav>
          {loadError && (
            <p className="session-sidebar-error" role="alert">
              Could not load sessions: {loadError}
            </p>
          )}
          <ul className="session-list">
            {sessions.map((session) => (
              <li key={`${session.title}-${session.url}`}>
                <button
                  type="button"
                  className={
                    session.title === activeTitle
                      ? 'session-item session-item--active'
                      : 'session-item'
                  }
                  onClick={() => selectSession(session)}
                >
                  {session.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="viewer-main">
          <div className="frame-wrap">
            {iframeSrc ? (
              <iframe
                key={frameKey}
                title={activeTitle ? `Embedded: ${activeTitle}` : 'Embedded page'}
                src={iframeSrc}
                className="embed-frame"
              />
            ) : (
              <section className="placeholder">
                <img
                  src={`${assetBaseUrl}rtcStats-logo.png`}
                  alt="rtcStats logo"
                  className="placeholder-logo"
                />
                <p className="placeholder-subtitle">
                  Select a session on the left to load it in the viewer.
                </p>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
