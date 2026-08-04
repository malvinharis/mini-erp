'use client';
import { useTranslation } from '@/i18n/client';
import type { RevenuePoint } from '@/lib/schemas';
import { formatCurrency } from '@/lib/utils/format';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface Props {
  data: RevenuePoint[];
}

export function RevenueChart({ data }: Props) {
  const { t } = useTranslation('dashboard');

  const chartData = {
    labels: data.map((point) => point.month),
    datasets: [
      {
        label: t('chart.revenue'),
        data: data.map((point) => Number(point.total)),
        backgroundColor: '#2dd4bf', // teal-400
        hoverBackgroundColor: '#14b8a6', // teal-500
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 44,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item) => formatCurrency(Number(item.raw)),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#737373' },
      },
      y: {
        grid: { color: '#f5f5f5' },
        border: { display: false },
        ticks: {
          color: '#737373',
          callback: (value) => formatCurrency(Number(value)),
        },
      },
    },
  };

  return (
    <div className="h-[280px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
