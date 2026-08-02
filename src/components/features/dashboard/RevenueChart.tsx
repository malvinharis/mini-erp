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
        backgroundColor: '#6366f1',
        borderRadius: 4,
        maxBarThickness: 48,
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
      x: { grid: { display: false } },
      y: {
        ticks: {
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
