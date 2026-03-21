import { api, type CaptureType, type DeviceInfo } from '@services/api'
import { useCallback, useEffect, useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import DeviceList from './components/DeviceList'
import StreamPanel from './components/StreamPanel'

export function DevicesPage() {
  const [devices, setDevices] = useState<string[]>([])
  const [selectedDevice, setSelectedDevice] = useState('')
  const [deviceInfos, setDeviceInfos] = useState<Record<string, DeviceInfo>>({})
  const [streamUrl, setStreamUrl] = useState('')
  const [streamKey] = useState(0)
  const [captureType, setCaptureType] = useState<CaptureType>(
    () => (localStorage.getItem('capture-type') as CaptureType) ?? 'minicap'
  )

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
    api
      .streamUrl(selectedDevice, captureType)
      .then(setStreamUrl)
      .catch(() => setStreamUrl(''))
  }, [selectedDevice, captureType])

  function handleCaptureTypeChange(type: CaptureType) {
    setCaptureType(type)
    localStorage.setItem('capture-type', type)
  }

  const selectedInfo = deviceInfos[selectedDevice]

  return (
    <Group orientation="horizontal">
      <Panel minSize={"25%"} defaultSize={"75%"}>
        <DeviceList
          devices={devices}
          selectedDevice={selectedDevice}
          deviceInfos={deviceInfos}
          captureType={captureType}
          onSelect={setSelectedDevice}
          onRefresh={refreshDevices}
          onInfoLoaded={(serial, info) => setDeviceInfos((prev) => ({ ...prev, [serial]: info }))}
          onCaptureTypeChange={handleCaptureTypeChange}
        />
      </Panel>
      <Separator />
      <Panel minSize={"25%"}>
        <StreamPanel
          device={selectedDevice}
          streamUrl={streamUrl}
          streamKey={streamKey}
          deviceInfo={selectedInfo}
        />
      </Panel>
    </Group>
  )
}
