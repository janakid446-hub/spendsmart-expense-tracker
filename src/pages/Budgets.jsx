import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { getBudgetStatus } from '../utils/calculations';
import { BUDGET_CATEGORIES, getCurrentMonthKey } from '../utils/constants';

export default function Budgets() {
  const { transactions, budgets, setBudgetForCategory, isHydrated } = useApp();
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey());

  const statusList = useMemo(() => {
    const statuses = getBudgetStatus(monthKey, budgets, transactions);
    const statusMap = Object.fromEntries(statuses.map((s) => [s.category, s]));

    return BUDGET_CATEGORIES.map((category) => {
      if (statusMap[category]) return statusMap[category];
      const budget = Number(budgets[monthKey]?.[category]) || 0;
      return {
        category,
        budget,
        spent: 0,
        percentUsed: 0,
        remaining: budget,
        tier: 'green',
      };
    });
  }, [monthKey, budgets, transactions]);

  const handleSave = (category, value) => {
    setBudgetForCategory(monthKey, category, value);
  };

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl dark:text-white">
            Budget Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-gray-400">
            Set monthly budgets and track spending progress
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statusList.map((item) => (
          <BudgetCard
            key={item.category}
            {...item}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
}
