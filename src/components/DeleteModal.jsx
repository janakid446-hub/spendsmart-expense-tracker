import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function DeleteModal() {
  const { deleteTarget, setDeleteTarget, deleteTransaction } = useApp();
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!deleteTarget) return;
    cancelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setDeleteTarget(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [deleteTarget, setDeleteTarget]);

  if (!deleteTarget) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setDeleteTarget(null)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 id="delete-modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
          Delete Transaction
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this transaction?
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteTransaction(deleteTarget)}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
