import { api, type CaptureType, type DeviceInfo } from '@services/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import DeviceList from './components/DeviceList'
import StreamPanel from './components/StreamPanel'

export function DevicesPage() {
  const [devices, setDevices] = useState<string[]>([])
  const [selectedDevice, setSelectedDevice] = useState('')
  const [deviceInfos, setDeviceInfos] = useState<Record<string, DeviceInfo>>({})
  const [streamUrl, setStreamUrl] = useState('')
  const [streamKey] = useState(0)
  const [listWidth, setListWidth] = useState(420)
  const [isDragging, setIsDragging] = useState(false)
  const [captureType, setCaptureType] = useState<CaptureType>(
    () => (localStorage.getItem('capture-type') as CaptureType) ?? 'minicap'
  )
  const draggingRef = useRef(false)

  const refreshDevices = useCallback(async () => {
    const list = await api.devices().catch(() => [] as string[])
    setDevices(list)
    if (list.length > 0 && !list.includes(selectedDevice)) {
      setSelectedDevice(list[0])
    }
  }, [selectedDevice])

  useEffect(() => {
    refreshDevices()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Resolve stream URL when device or captureType changes
  useEffect(() => {
    if (!selectedDevice) {
      setStreamUrl('')
      return
    }
    api.streamUrl(selectedDevice, captureType).then(setStreamUrl).catch(() => setStreamUrl(''))
  }, [selectedDevice, captureType])

  function handleCaptureTypeChange(type: CaptureType) {
    setCaptureType(type)
    localStorage.setItem('capture-type', type)
  }

  // Resizer: drag handle between list panel and stream panel
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return
      // 56 = sidebar width
      const w = Math.max(220, Math.min(800, e.clientX - 56))
      setListWidth(w)
    }
    function onUp() {
      draggingRef.current = false
      setIsDragging(false)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const selectedInfo = deviceInfos[selectedDevice]

  return (
    <div className={`flex flex-1 overflow-hidden${isDragging ? ' select-none' : ''}`}>
      {/* Left: device list — widest panel by default */}
      <div style={{ width: listWidth }} className="flex-shrink-0 overflow-hidden">
        <DeviceList
          devices={devices}
          selectedDevice={selectedDevice}
          deviceInfos={deviceInfos}
          captureType={captureType}
          onSelect={setSelectedDevice}
          onRefresh={refreshDevices}
          onInfoLoaded={(serial, info) =>
            setDeviceInfos((prev) => ({ ...prev, [serial]: info }))
          }
          onCaptureTypeChange={handleCaptureTypeChange}
        />
      </div>

      {/* Drag handle — stream panel can expand left */}
      <div
        onMouseDown={() => { draggingRef.current = true; setIsDragging(true) }}
        className="w-1.5 flex-shrink-0 cursor-ew-resize bg-slate-200 transition-colors hover:bg-primary/50 dark:bg-slate-800 dark:hover:bg-primary/50"
      />

      {/* Right: stream panel — takes remaining space */}
      <StreamPanel
        device={selectedDevice}
        streamUrl={streamUrl}
        streamKey={streamKey}
        deviceInfo={selectedInfo}
      />
    </div>
  )
}
