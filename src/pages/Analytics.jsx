import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import PieChart from '../components/PieChart';
import { SkeletonChart, SkeletonCard } from '../components/SkeletonCard';
import {
  getCategoryExpenses,
  getMonthlySpendingTrend,
  getTopCategories,
  getInsights,
  getBudgetAlerts,
} from '../utils/calculations';
import { formatCurrency, getCurrentMonthKey, CATEGORY_ICONS } from '../utils/constants';
import { buildLineTrendData, getBaseChartOptions } from '../utils/chartHelpers';

export default function Analytics() {
  const { transactions, budgets, isHydrated, theme } = useApp();
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());

  const categoryMap = useMemo(
    () => getCategoryExpenses(transactions, monthKey),
    [transactions, monthKey]
  );

  const trend = useMemo(() => getMonthlySpendingTrend(transactions, 6), [transactions]);

  const topCategories = useMemo(
    () => getTopCategories(transactions, 5, monthKey),
    [transactions, monthKey]
  );

  const insights = useMemo(
    () => getInsights(transactions, monthKey),
    [transactions, monthKey]
  );

  const alerts = useMemo(
    () => getBudgetAlerts(monthKey, budgets, transactions),
    [monthKey, budgets, transactions]
  );

  const lineData = useMemo(() => buildLineTrendData(trend.labels, trend.data), [trend]);
  const lineOptions = useMemo(() => getBaseChartOptions(), [theme]);

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-10 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl dark:text-white">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-gray-400">
            Insights and spending trends
          </p>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Month</span>
          <input
            type="month"
            value={monthKey}
            onChange={(e) => setMonthKey(e.target.value)}
            className="min-h-11 rounded-xl border border-gray-300 px-3 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </label>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400">Budget Alerts</h2>
          {alerts.map((alert) => (
            <div
              key={alert.category}
              className="rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20"
              role="alert"
            >
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                {alert.category} Budget: {formatCurrency(alert.budget)}
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Spent: {formatCurrency(alert.spent)} · Status: Warning ({alert.percentUsed.toFixed(0)}% used)
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PieChart categoryMap={categoryMap} title="Category-wise Expenses" />
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
            Monthly Spending Trend
          </h3>
          <div className="relative h-64 w-full overflow-hidden md:h-80">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Top Categories</h2>
        {topCategories.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No spending data for this month</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {topCategories.map(({ category, amount }, i) => {
              const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;
              return (
                <div
                  key={category}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600 dark:bg-primary-900/40">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="text-primary-600 dark:text-primary-400" />
                      <span className="truncate font-medium text-gray-900 dark:text-white">
                        {category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Highest Spending', value: insights.highestCategory },
          { label: 'Lowest Spending', value: insights.lowestCategory },
          { label: 'Average Expense', value: formatCurrency(insights.avgExpense) },
          { label: 'Total Transactions', value: insights.totalTransactions },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">{label}</p>
            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
