import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import FilterBar from '../components/FilterBar';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import { SkeletonTransactionList } from '../components/SkeletonCard';
import { filterAndSortTransactions, getAvailableMonths } from '../utils/calculations';
import { exportTransactionsToCsv } from '../utils/csvExport';
import { SORT_OPTIONS } from '../utils/constants';

const defaultFilters = {
  search: '',
  type: 'all',
  category: 'all',
  month: 'all',
  sort: SORT_OPTIONS.LATEST,
};

export default function Transactions() {
  const { transactions, isHydrated } = useApp();
  const [filters, setFilters] = useState(defaultFilters);

  const availableMonths = useMemo(
    () => getAvailableMonths(transactions),
    [transactions]
  );

  const filtered = useMemo(
    () => filterAndSortTransactions(transactions, filters),
    [transactions, filters]
  );

  const handleFilterChange = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleExport = useCallback(() => {
    const result = exportTransactionsToCsv(filtered);
    if (!result.success) {
      alert(result.message);
    }
  }, [filtered]);

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <SkeletonTransactionList count={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl dark:text-white">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-gray-400">
          Search, filter, and manage all transactions
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        availableMonths={availableMonths}
        onExport={handleExport}
      />

      {filtered.length === 0 ? (
        <EmptyState
          message={
            transactions.length === 0
              ? 'No transactions found'
              : 'No transactions match your filters'
          }
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
