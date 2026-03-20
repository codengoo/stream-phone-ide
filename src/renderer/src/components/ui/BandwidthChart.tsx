import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

interface Props {
  data: number[]
  width?: number
  height?: number
}

export function BandwidthChart({ data, width = 80, height = 28 }: Props) {
  const series = [{ data: data.length >= 2 ? data : [0, 0] }]

  const options: ApexOptions = {
    chart: {
      type: 'area',
      sparkline: { enabled: true },
      animations: { enabled: false }
    },
    stroke: { curve: 'smooth', width: 1.5 },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.4, opacityTo: 0.05 }
    },
    colors: ['#ff4500'],
    tooltip: { enabled: false },
    yaxis: { min: 0 }
  }

  return (
    <ReactApexChart
      type="area"
      series={series}
      options={options}
      width={width}
      height={height}
    />
  )
}
