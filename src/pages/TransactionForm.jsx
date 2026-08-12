import { Navigate, useParams } from 'react-router-dom';
import AddTransactionForm from '../components/AddTransactionForm';
import { useApp } from '../context/AppContext';

export default function TransactionFormPage() {
  const { id } = useParams();
  const { getTransactionById } = useApp();
  const isEdit = Boolean(id);

  if (isEdit) {
    const transaction = getTransactionById(id);
    if (!transaction) {
      return <Navigate to="/transactions" replace />;
    }
    return <AddTransactionForm transaction={transaction} isEdit />;
  }

  return <AddTransactionForm />;
}
