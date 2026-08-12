import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaWallet, FaBars, FaTimes, FaMoon, FaSun, FaPlus } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/budgets', label: 'Budgets' },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition min-h-11 inline-flex items-center ${
    isActive
      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useApp();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400"
        >
          <FaWallet className="text-2xl" aria-hidden />
          <span>SpendSmart</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          <Link
            to="/transactions/new"
            className="hidden items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:inline-flex min-h-11"
          >
            <FaPlus aria-hidden />
            Add Transaction
          </Link>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gray-200 md:hidden dark:border-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 right-0 top-full z-40 border-b border-gray-200 bg-white p-4 shadow-lg md:hidden dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/transactions/new"
                className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <FaPlus aria-hidden />
                Add Transaction
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
