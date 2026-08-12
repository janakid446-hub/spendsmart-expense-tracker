import { format, parseISO } from 'date-fns';

function escapeCsvField(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportTransactionsToCsv(transactions, filename = 'spendsmart-transactions.csv') {
  if (!transactions.length) {
    return { success: false, message: 'No transactions to export' };
  }

  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  const rows = transactions.map((t) => [
    format(parseISO(t.date), 'yyyy-MM-dd'),
    t.type,
    t.category,
    t.description,
    t.amount,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);

  return { success: true };
}
