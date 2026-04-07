import { useState } from 'react'
import './App.css'

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export default function App() {
  const assetBaseUrl = import.meta.env.BASE_URL
  const [inputValue, setInputValue] = useState('')
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)
  /** Bumps on every Load so the iframe remounts even when `src` is unchanged (browser would not reload otherwise). */
  const [frameKey, setFrameKey] = useState(0)

  const loadUrl = () => {
    const url = normalizeUrl(inputValue)
    setFrameKey((k) => k + 1)
    setIframeSrc(url || null)
    console.log('[embed-rtcstats] Load', { url: url || null, frameKey: frameKey + 1 })
  }

  return (
    <div className="app">
      <header className="toolbar">
        <img
          src={`${assetBaseUrl}icon.png`}
          alt="rtcStats icon"
          className="toolbar-icon"
        />
        <label className="url-field">
          <span className="sr-only">URL to embed</span>
          <input
            type="url"
            name="url"
            placeholder="https://example.com"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') loadUrl()
            }}
          />
        </label>
        <button type="button" onClick={loadUrl}>
          Load
        </button>
      </header>
      <div className="toolbar-separator" />
      <main className="frame-wrap">
        {iframeSrc ? (
          <iframe
            key={frameKey}
            title="Embedded page"
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
              Copy/Paste an URL to an embedded session and click Load to display
              it
            </p>
          </section>
        )}
      </main>
    </div>
  )
}
