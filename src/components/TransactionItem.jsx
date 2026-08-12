import { memo } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FaPen, FaTrash } from 'react-icons/fa';
import { CATEGORY_ICONS, formatCurrency } from '../utils/constants';
import { useApp } from '../context/AppContext';

function TransactionItem({ transaction }) {
  const { setDeleteTarget } = useApp();
  const Icon = CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.Other;
  const isIncome = transaction.type === 'income';

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-800">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            isIncome
              ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
          }`}
        >
          <Icon className="text-xl" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900 dark:text-white">
            {transaction.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {transaction.category} · {format(parseISO(transaction.date), 'dd MMM yyyy')}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p
          className={`text-lg font-bold ${
            isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
        <div className="flex gap-2">
          <Link
            to={`/transactions/${transaction.id}/edit`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={`Edit ${transaction.description}`}
          >
            <FaPen />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(transaction.id)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gray-200 text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:hover:bg-red-900/20"
            aria-label={`Delete ${transaction.description}`}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(TransactionItem);
