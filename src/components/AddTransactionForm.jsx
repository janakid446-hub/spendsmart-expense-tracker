import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../utils/constants';
import { useApp } from '../context/AppContext';

const emptyForm = {
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
};

export default function AddTransactionForm({ transaction, isEdit = false }) {
  const navigate = useNavigate();
  const { addTransaction, updateTransaction } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        amount: String(transaction.amount),
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
      });
    }
  }, [transaction]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const next = {};
    if (!form.amount || Number(form.amount) <= 0) {
      next.amount = 'Amount is required and must be greater than 0';
    }
    if (!form.description.trim()) {
      next.description = 'Description is required';
    }
    if (!form.category) {
      next.category = 'Category is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
    };

    if (isEdit && transaction) {
      updateTransaction(transaction.id, payload);
    } else {
      addTransaction(payload);
    }
    navigate('/');
  };

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      category: '',
    }));
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      noValidate
    >
      <h1 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
        {isEdit ? 'Edit Transaction' : 'Add Transaction'}
      </h1>

      <div className="mb-6">
        <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Transaction Type
        </span>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`min-h-11 rounded-lg text-sm font-semibold capitalize transition ${
                form.type === t
                  ? t === 'income'
                    ? 'bg-green-600 text-white shadow'
                    : 'bg-red-600 text-white shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount (₹)
        </label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full min-h-11 rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="0.00"
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full min-h-11 rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full min-h-11 rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          placeholder="What was this for?"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full min-h-11 rounded-xl border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Save Transaction
        </button>
      </div>
    </form>
  );
}
