import { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { buildPieData, getBaseChartOptions } from '../utils/chartHelpers';
import { useApp } from '../context/AppContext';

export default function PieChart({ categoryMap, title }) {
  const { theme } = useApp();
  const hasData = Object.keys(categoryMap).length > 0;

  const data = useMemo(() => buildPieData(categoryMap), [categoryMap]);
  const options = useMemo(
    () => ({
      ...getBaseChartOptions(),
      scales: undefined,
    }),
    [theme]
  );

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:h-80">
        <p className="text-sm text-gray-500 dark:text-gray-400">No expense data to display</p>
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
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
