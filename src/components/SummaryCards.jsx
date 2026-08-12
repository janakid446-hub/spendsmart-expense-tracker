import { formatCurrency } from '../utils/constants';

function Card({ title, value, className = '', valueClassName = '' }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className={`mt-2 text-2xl font-bold sm:text-3xl ${valueClassName}`}>{value}</p>
    </div>
  );
}

export default function SummaryCards({ balance, income, expenses }) {
  const balanceColor =
    balance >= 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card title="Total Balance" value={formatCurrency(balance)} valueClassName={balanceColor} />
      <Card
        title="Total Income"
        value={formatCurrency(income)}
        valueClassName="text-green-600 dark:text-green-400"
      />
      <Card
        title="Total Expenses"
        value={formatCurrency(expenses)}
        valueClassName="text-red-600 dark:text-red-400"
      />
    </div>
  );
}
