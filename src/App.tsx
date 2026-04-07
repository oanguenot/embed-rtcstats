import { useState } from 'react'
import './App.css'

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export default function App() {
  const [inputValue, setInputValue] = useState('')
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)

  const loadUrl = () => {
    const url = normalizeUrl(inputValue)
    setIframeSrc(url || null)
  }

  return (
    <div className="app">
      <header className="toolbar">
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
      <main className="frame-wrap">
        {iframeSrc ? (
          <iframe
            title="Embedded page"
            src={iframeSrc}
            className="embed-frame"
          />
        ) : (
          <p className="placeholder">Enter a URL and click Load to preview it here.</p>
        )}
      </main>
    </div>
  )
}
