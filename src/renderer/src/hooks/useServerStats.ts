import { useState, useEffect, useRef } from 'react'

const MAX_SAMPLES = 20
const POLL_MS = 2000

export interface ServerStats {
  isOnline: boolean
  bwHistory: number[]
  currentBw: number
  liveSeconds: number
}

export function useServerStats(): ServerStats {
  const [isOnline, setIsOnline] = useState(false)
  const [bwHistory, setBwHistory] = useState<number[]>([])
  const [currentBw, setCurrentBw] = useState(0)
  const [liveSeconds, setLiveSeconds] = useState(0)
  const prevBytesRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const id = setInterval(async () => {
      const [healthy, status] = await Promise.all([
        window.streamAPI.getHealth().catch(() => false),
        window.streamAPI.getStatus().catch(() => null)
      ])

      setIsOnline(healthy)

      if (healthy) {
        if (!startRef.current) startRef.current = Date.now()
        setLiveSeconds(Math.floor((Date.now() - startRef.current!) / 1000))
      } else {
        startRef.current = null
        setLiveSeconds(0)
      }

      const bytes = (status as Record<string, unknown> | null)?.byteCount
      if (typeof bytes === 'number') {
        if (prevBytesRef.current !== null) {
          const delta = Math.max(0, bytes - prevBytesRef.current)
          const kbps = Math.round((delta / 1024) * (1000 / POLL_MS))
          setCurrentBw(kbps)
          setBwHistory((h) => [...h.slice(-(MAX_SAMPLES - 1)), kbps])
        }
        prevBytesRef.current = bytes
      }
    }, POLL_MS)

    return () => clearInterval(id)
  }, [])

  return { isOnline, bwHistory, currentBw, liveSeconds }
}
