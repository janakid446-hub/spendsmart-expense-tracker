import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import DeleteModal from './components/DeleteModal';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import TransactionFormPage from './pages/TransactionForm';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/spendsmart-expense-tracker">
        <div className="flex min-h-screen flex-col overflow-x-hidden transition-colors">
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<TransactionFormPage />} />
              <Route path="/transactions/:id/edit" element={<TransactionFormPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budgets" element={<Budgets />} />
            </Routes>
          </main>
          <DeleteModal />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
