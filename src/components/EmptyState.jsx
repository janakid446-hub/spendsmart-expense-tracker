import { Link } from 'react-router-dom';
import { FaReceipt } from 'react-icons/fa';

export default function EmptyState({ message = 'No transactions found' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-600 dark:bg-gray-800">
      <FaReceipt className="mb-4 text-5xl text-gray-400 dark:text-gray-500" aria-hidden />
      <p className="mb-6 text-lg font-medium text-gray-600 dark:text-gray-300">{message}</p>
      <Link
        to="/transactions/new"
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        Add Transaction
      </Link>
    </div>
  );
}
