import { FaDownload, FaSearch } from 'react-icons/fa';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  SORT_OPTIONS,
} from '../utils/constants';

export default function FilterBar({
  filters,
  onChange,
  availableMonths,
  onExport,
}) {
  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="relative">
        <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search by description or category..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full min-h-11 rounded-xl border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          aria-label="Search transactions"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'income', label: 'Income' },
          { value: 'expense', label: 'Expense' },
        ].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange({ type: value })}
            className={`min-h-11 rounded-xl px-4 py-2 text-sm font-medium transition ${
              filters.type === value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Category</span>
          <select
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full min-h-11 rounded-xl border border-gray-300 px-3 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Month</span>
          <select
            value={filters.month}
            onChange={(e) => onChange({ month: e.target.value })}
            className="w-full min-h-11 rounded-xl border border-gray-300 px-3 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="all">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Sort By</span>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value })}
            className="w-full min-h-11 rounded-xl border border-gray-300 px-3 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value={SORT_OPTIONS.LATEST}>Latest First</option>
            <option value={SORT_OPTIONS.OLDEST}>Oldest First</option>
            <option value={SORT_OPTIONS.HIGHEST}>Highest Amount</option>
            <option value={SORT_OPTIONS.LOWEST}>Lowest Amount</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={onExport}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary-600 px-4 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 sm:w-auto dark:hover:bg-primary-900/20"
      >
        <FaDownload aria-hidden />
        Export to CSV
      </button>
    </div>
  );
}
