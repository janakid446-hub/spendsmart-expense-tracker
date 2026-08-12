import { parseISO, format, subMonths } from 'date-fns';
import { getCurrentMonthKey } from './constants';

function parseDate(dateStr) {
  return parseISO(dateStr);
}

function isInMonth(transaction, monthKey) {
  if (!monthKey) return true;
  const d = parseDate(transaction.date);
  const [year, month] = monthKey.split('-').map(Number);
  return d.getFullYear() === year && d.getMonth() + 1 === month;
}

export function getTotalIncome(transactions) {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

export function getTotalExpenses(transactions) {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

export function getBalance(transactions) {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

export function getTransactionCount(transactions) {
  return transactions.length;
}

export function getHighestExpense(transactions) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (!expenses.length) return 0;
  return Math.max(...expenses.map((t) => Number(t.amount)));
}

export function getAvgDailySpending(transactions, monthKey = getCurrentMonthKey()) {
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && isInMonth(t, monthKey)
  );
  if (!monthExpenses.length) return 0;
  const total = monthExpenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const [year, month] = monthKey.split('-').map(Number);
  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() + 1 === month;
  const daysInMonth = isCurrentMonth
    ? Math.max(1, now.getDate())
    : new Date(year, month, 0).getDate();
  return total / daysInMonth;
}

export function getCurrentMonthSpending(transactions, monthKey = getCurrentMonthKey()) {
  return transactions
    .filter((t) => t.type === 'expense' && isInMonth(t, monthKey))
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

export function getCategoryExpenses(transactions, monthKey) {
  const map = {};
  transactions
    .filter((t) => t.type === 'expense' && isInMonth(t, monthKey))
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
  return map;
}

export function getLast6MonthsComparison(transactions) {
  const labels = [];
  const incomeData = [];
  const expenseData = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const key = format(monthDate, 'yyyy-MM');
    labels.push(format(monthDate, 'MMM yyyy'));
    incomeData.push(
      transactions
        .filter((t) => t.type === 'income' && isInMonth(t, key))
        .reduce((s, t) => s + Number(t.amount), 0)
    );
    expenseData.push(
      transactions
        .filter((t) => t.type === 'expense' && isInMonth(t, key))
        .reduce((s, t) => s + Number(t.amount), 0)
    );
  }

  return { labels, incomeData, expenseData };
}

export function getMonthlySpendingTrend(transactions, months = 6) {
  const labels = [];
  const data = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const key = format(monthDate, 'yyyy-MM');
    labels.push(format(monthDate, 'MMM'));
    data.push(getCurrentMonthSpending(transactions, key));
  }

  return { labels, data };
}

export function getTopCategories(transactions, n = 5, monthKey) {
  const map = getCategoryExpenses(transactions, monthKey);
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
}

export function getInsights(transactions, monthKey) {
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && isInMonth(t, monthKey)
  );
  const map = getCategoryExpenses(transactions, monthKey);
  const entries = Object.entries(map);

  let highestCategory = '—';
  let lowestCategory = '—';
  let highestAmount = 0;
  let lowestAmount = Infinity;

  entries.forEach(([cat, amt]) => {
    if (amt > highestAmount) {
      highestAmount = amt;
      highestCategory = cat;
    }
    if (amt < lowestAmount && amt > 0) {
      lowestAmount = amt;
      lowestCategory = cat;
    }
  });

  if (!entries.length) lowestCategory = '—';

  const avgExpense = monthExpenses.length
    ? monthExpenses.reduce((s, t) => s + Number(t.amount), 0) / monthExpenses.length
    : 0;

  return {
    highestCategory,
    lowestCategory,
    avgExpense,
    totalTransactions: monthExpenses.length,
  };
}

export function getBudgetTier(percentUsed) {
  if (percentUsed >= 80) return 'red';
  if (percentUsed >= 60) return 'yellow';
  return 'green';
}

export function getBudgetStatus(monthKey, budgets, transactions) {
  const monthBudgets = budgets[monthKey] || {};
  return Object.keys(monthBudgets).map((category) => {
    const budget = Number(monthBudgets[category]) || 0;
    const spent = transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.category === category &&
          isInMonth(t, monthKey)
      )
      .reduce((s, t) => s + Number(t.amount), 0);
    const percentUsed = budget > 0 ? (spent / budget) * 100 : 0;
    const remaining = Math.max(0, budget - spent);
    return {
      category,
      budget,
      spent,
      percentUsed,
      remaining,
      tier: getBudgetTier(percentUsed),
      isWarning: percentUsed >= 80 && budget > 0,
    };
  });
}

export function getBudgetAlerts(monthKey, budgets, transactions) {
  return getBudgetStatus(monthKey, budgets, transactions).filter((b) => b.isWarning);
}

export function filterAndSortTransactions(transactions, filters) {
  const {
    search = '',
    type = 'all',
    category = 'all',
    month = 'all',
    sort = 'latest',
  } = filters;

  let result = [...transactions];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  if (type !== 'all') {
    result = result.filter((t) => t.type === type);
  }

  if (category !== 'all') {
    result = result.filter((t) => t.category === category);
  }

  if (month !== 'all') {
    result = result.filter((t) => isInMonth(t, month));
  }

  switch (sort) {
    case 'oldest':
      result.sort((a, b) => parseDate(a.date) - parseDate(b.date));
      break;
    case 'highest':
      result.sort((a, b) => Number(b.amount) - Number(a.amount));
      break;
    case 'lowest':
      result.sort((a, b) => Number(a.amount) - Number(b.amount));
      break;
    case 'latest':
    default:
      result.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      break;
  }

  return result;
}

export function getAvailableMonths(transactions) {
  const months = new Set();
  transactions.forEach((t) => {
    const d = parseDate(t.date);
    months.add(format(d, 'yyyy-MM'));
  });
  months.add(getCurrentMonthKey());
  return Array.from(months).sort().reverse();
}

export function getRecentTransactions(transactions, count = 5) {
  return [...transactions]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, count);
}
