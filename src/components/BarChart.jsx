import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { buildBarComparisonData, getBaseChartOptions } from '../utils/chartHelpers';
import { useApp } from '../context/AppContext';

export default function BarChart({ labels, incomeData, expenseData, title }) {
  const { theme } = useApp();
  const hasData = incomeData.some((v) => v > 0) || expenseData.some((v) => v > 0);

  const data = useMemo(
    () => buildBarComparisonData(labels, incomeData, expenseData),
    [labels, incomeData, expenseData]
  );
  const options = useMemo(() => getBaseChartOptions(), [theme]);

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:h-80">
        <p className="text-sm text-gray-500 dark:text-gray-400">No data for the last 6 months</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {title && (
        <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
          {title}
        </h3>
      )}
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
