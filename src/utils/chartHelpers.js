import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { CHART_COLORS } from './constants';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

export function getChartTextColor() {
  return isDarkMode() ? '#e5e7eb' : '#374151';
}

export function getChartGridColor() {
  return isDarkMode() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
}

export function buildPieData(categoryMap) {
  const labels = Object.keys(categoryMap);
  const data = Object.values(categoryMap);
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderWidth: 0,
      },
    ],
  };
}

export function getBaseChartOptions() {
  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          padding: 16,
          boxWidth: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed ?? ctx.raw;
            return ` ₹${Number(value).toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: {
          color: textColor,
          callback: (v) => `₹${v}`,
        },
        grid: { color: gridColor },
      },
    },
  };
}

export function buildBarComparisonData(labels, incomeData, expenseData) {
  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#22c55e',
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: '#ef4444',
        borderRadius: 6,
      },
    ],
  };
}

export function buildLineTrendData(labels, data) {
  return {
    labels,
    datasets: [
      {
        label: 'Spending',
        data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };
}
