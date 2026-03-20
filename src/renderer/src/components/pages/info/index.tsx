import { useState, useEffect } from 'react'
import { LeftPanel } from '../../LeftPanel'
import type { StreamStatus } from '../../../../../preload/index.d'

const SERVER_URL = 'http://localhost:9373'

export default function InfoPage() {
  const [serverHealth, setServerHealth] = useState(false)
  const [status, setStatus] = useState<StreamStatus | null>(null)

  useEffect(() => {
    let cancelled = false
    async function poll(): Promise<void> {
      const ok = await window.streamAPI.getHealth().catch(() => false)
      if (cancelled) return
      setServerHealth(ok)
      if (ok) {
        const s = await window.streamAPI.getStatus().catch(() => null)
        if (!cancelled && s) setStatus(s)
      }
    }
    poll()
    const id = setInterval(poll, 5000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return <LeftPanel status={status} serverHealth={serverHealth} serverUrl={SERVER_URL} />
}
