import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SummaryCards from '../components/SummaryCards';
import StatisticsCards from '../components/StatisticsCards';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import {
  SkeletonSummary,
  SkeletonStats,
  SkeletonChart,
  SkeletonTransactionList,
} from '../components/SkeletonCard';
import {
  getBalance,
  getTotalIncome,
  getTotalExpenses,
  getTransactionCount,
  getHighestExpense,
  getAvgDailySpending,
  getCurrentMonthSpending,
  getCategoryExpenses,
  getLast6MonthsComparison,
  getRecentTransactions,
} from '../utils/calculations';
import { getCurrentMonthKey } from '../utils/constants';

export default function Dashboard() {
  const { transactions, isHydrated } = useApp();
  const monthKey = getCurrentMonthKey();

  const stats = useMemo(
    () => ({
      balance: getBalance(transactions),
      income: getTotalIncome(transactions),
      expenses: getTotalExpenses(transactions),
      count: getTransactionCount(transactions),
      highest: getHighestExpense(transactions),
      avgDaily: getAvgDailySpending(transactions, monthKey),
      monthSpending: getCurrentMonthSpending(transactions, monthKey),
    }),
    [transactions, monthKey]
  );

  const categoryMap = useMemo(
    () => getCategoryExpenses(transactions, monthKey),
    [transactions, monthKey]
  );

  const barData = useMemo(
    () => getLast6MonthsComparison(transactions),
    [transactions]
  );

  const recent = useMemo(
    () => getRecentTransactions(transactions, 5),
    [transactions]
  );

  if (!isHydrated) {
    return (
      <div className="space-y-8">
        <SkeletonSummary />
        <SkeletonStats />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <SkeletonTransactionList />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-gray-400">
          Overview of your finances
        </p>
      </div>

      <SummaryCards
        balance={stats.balance}
        income={stats.income}
        expenses={stats.expenses}
      />

      <StatisticsCards data={stats} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PieChart categoryMap={categoryMap} title="Category-wise Expenses" />
        <BarChart
          labels={barData.labels}
          incomeData={barData.incomeData}
          expenseData={barData.expenseData}
          title="Income vs Expenses (Last 6 Months)"
        />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
            Recent Transactions
          </h2>
          <Link
            to="/transactions"
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {recent.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
