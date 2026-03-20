import { useEffect, useRef, useState } from 'react'

interface Props {
  streamUrl: string
  streamKey: number
  screenWidth: number
  screenHeight: number
  /** Content rendered directly below the stream image */
  bottomBar?: React.ReactNode
  /** Content rendered to the right of the stream image */
  rightBar?: React.ReactNode
  /** Reserved height (px) for bottomBar — used in size calculation */
  bottomBarHeight?: number
  /** Reserved width (px) for rightBar — used in size calculation */
  rightBarWidth?: number
}

export function StreamDisplay({
  streamUrl,
  streamKey,
  screenWidth,
  screenHeight,
  bottomBar,
  rightBar,
  bottomBarHeight = 0,
  rightBarWidth = 0
}: Props): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (screenWidth === 0 || screenHeight === 0) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width: cw, height: ch } = entry.contentRect
      const availW = cw - rightBarWidth
      const availH = ch - bottomBarHeight
      const deviceRatio = screenWidth / screenHeight
      const containerRatio = availW / availH
      let w: number, h: number
      if (deviceRatio < containerRatio) {
        h = availH
        w = availH * deviceRatio
      } else {
        w = availW
        h = availW / deviceRatio
      }
      setImgSize({ width: Math.floor(w), height: Math.floor(h) })
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [screenWidth, screenHeight, rightBarWidth, bottomBarHeight])

  const url = streamUrlProp(streamUrl, streamKey)
  const hasExtra = bottomBar !== undefined || rightBar !== undefined

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#0d0f1a]"
    >
      {hasExtra && imgSize ? (
        <div className="flex flex-col">
          <div className="flex flex-row">
            <img
              key={streamKey}
              src={url}
              alt="Device screen"
              className="block rounded-lg object-contain shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
              style={{ width: imgSize.width, height: imgSize.height }}
              draggable={false}
            />
            {rightBar && rightBarWidth > 0 && (
              <div style={{ width: rightBarWidth, height: imgSize.height }}>{rightBar}</div>
            )}
          </div>
          {bottomBar && bottomBarHeight > 0 && (
            <div style={{ height: bottomBarHeight }}>{bottomBar}</div>
          )}
        </div>
      ) : (
        <img
          key={streamKey}
          src={url}
          alt="Device screen"
          className="block rounded-lg object-contain shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
          style={imgSize ? { width: imgSize.width, height: imgSize.height } : { maxWidth: '100%', maxHeight: '100%' }}
          draggable={false}
        />
      )}
    </div>
  )
}

function streamUrlProp(base: string, key: number) {
  if (!base) return ''
  return base.includes('?') ? `${base}&t=${key}` : `${base}?t=${key}`
}

