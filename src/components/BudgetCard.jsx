import { CATEGORY_ICONS, formatCurrency } from '../utils/constants';

const tierStyles = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

const tierText = {
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
};

export default function BudgetCard({ category, budget, spent, percentUsed, remaining, tier, onSave }) {
  const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;
  const clampedPercent = Math.min(percentUsed, 100);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
          <Icon aria-hidden />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
          <p className={`text-sm font-medium ${tierText[tier]}`}>
            {percentUsed.toFixed(0)}% used
          </p>
        </div>
      </div>

      <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all ${tierStyles[tier]}`}
          style={{ width: `${clampedPercent}%` }}
          role="progressbar"
          aria-valuenow={clampedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${category} budget ${percentUsed.toFixed(0)}% used`}
        />
      </div>

      <div className="mb-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Spent: {formatCurrency(spent)}</span>
        <span>Remaining: {formatCurrency(remaining)}</span>
      </div>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Monthly Budget (₹)
        <input
          type="number"
          min="0"
          step="100"
          defaultValue={budget || ''}
          onBlur={(e) => onSave(category, e.target.value)}
          className="mt-1 w-full min-h-11 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="Set budget"
        />
      </label>
    </div>
  );
}
