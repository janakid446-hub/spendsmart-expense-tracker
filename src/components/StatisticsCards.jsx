import { formatCurrency } from '../utils/constants';

const stats = [
  { key: 'count', label: 'Total Transactions', format: (v) => v },
  { key: 'highest', label: 'Highest Expense', format: formatCurrency },
  { key: 'avgDaily', label: 'Avg Daily Spending', format: formatCurrency },
  { key: 'monthSpending', label: 'Current Month Spending', format: formatCurrency },
];

export default function StatisticsCards({ data }) {
  const values = {
    count: data.count,
    highest: data.highest,
    avgDaily: data.avgDaily,
    monthSpending: data.monthSpending,
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ key, label, format }) => (
        <div
          key={key}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">{label}</p>
          <p className="mt-2 text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
            {format(values[key])}
          </p>
        </div>
      ))}
    </div>
  );
}
