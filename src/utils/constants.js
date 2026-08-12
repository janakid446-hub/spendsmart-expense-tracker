import {
  FaPizzaSlice,
  FaHome,
  FaCar,
  FaShoppingCart,
  FaHeartbeat,
  FaFilm,
  FaGraduationCap,
  FaFileInvoiceDollar,
  FaPlane,
  FaEllipsisH,
  FaMoneyBillWave,
  FaLaptopCode,
  FaChartLine,
  FaGift,
} from 'react-icons/fa';

export const STORAGE_KEYS = {
  TRANSACTIONS: 'spendsmart_transactions',
  BUDGETS: 'spendsmart_budgets',
  THEME: 'spendsmart_theme',
};

export const EXPENSE_CATEGORIES = [
  'Food',
  'Rent',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Education',
  'Bills',
  'Travel',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
];

export const BUDGET_CATEGORIES = [...EXPENSE_CATEGORIES];

export const CATEGORY_ICONS = {
  Food: FaPizzaSlice,
  Rent: FaHome,
  Transport: FaCar,
  Shopping: FaShoppingCart,
  Health: FaHeartbeat,
  Entertainment: FaFilm,
  Education: FaGraduationCap,
  Bills: FaFileInvoiceDollar,
  Travel: FaPlane,
  Other: FaEllipsisH,
  Salary: FaMoneyBillWave,
  Freelance: FaLaptopCode,
  Investment: FaChartLine,
  Gift: FaGift,
};

export const SORT_OPTIONS = {
  LATEST: 'latest',
  OLDEST: 'oldest',
  HIGHEST: 'highest',
  LOWEST: 'lowest',
};

export const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
];

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

export function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
