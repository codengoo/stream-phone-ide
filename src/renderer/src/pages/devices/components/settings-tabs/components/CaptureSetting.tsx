import useCaptureSetting from '@renderer/hooks/useCaptureSetting'
import { IconBroadcast, IconDeviceUsb } from '@tabler/icons-react'
import { CaptureTypeCard, ICaptureOption } from './CaptureTypeCard'

const CAPTURE_OPTIONS: ICaptureOption[] = [
  {
    value: 'minicap',
    label: 'MiniCap',
    icon: <IconBroadcast size={22} />,
    summary: 'Fast MJPEG via native library',
    details:
      'Requires the minicap binary deployed on the device. Delivers the highest frame rate with minimal CPU overhead. Not compatible with some heavily customised ROMs (MIUI, ColorOS). A running minicap service on the relay server is required.'
  },
  {
    value: 'adbcap',
    label: 'ADBCap',
    icon: <IconDeviceUsb size={22} />,
    summary: 'Screen capture via ADB screencap',
    details:
      'Uses the standard adb screencap command — no extra binary required on the device. Works on nearly every ADB-enabled device. Lower frame rate (~5–10 fps) and higher CPU overhead than minicap. Suitable when binary deployment is not possible.'
  }
]

export function CaptureSetting() {
  const { state: captureState, setCaptureType } = useCaptureSetting()
  const captureType = captureState.captureType

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-default-600">Capture mode</p>
      <div className="space-y-2">
        {CAPTURE_OPTIONS.map((opt) => (
          <CaptureTypeCard
            key={opt.value}
            option={opt}
            selected={captureType === opt.value}
            onSelect={() => setCaptureType(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
