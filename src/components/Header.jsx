import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useRef, useEffect } from 'react';
import {
  PlusCircle,
  LogIn,
  Users,
  Clock,
  CircleDollarSign,
  UserCircle2,
  LogOut,
  Menu,
  X
} from 'lucide-react';

import { setCurrency, openAddEmployeeDrawer } from '../slices/uiSlice';
import { fetchPayrollSummary } from '../slices/payrollSummarySlice';
import { logout } from '../slices/authSlice';
import { LoginModal } from './LoginModal';
import { RoleSwitcher } from './RoleSwitcher.jsx';

// Sub-component: InfoBox
const InfoBox = ({ icon, title, value }) => {
  const IconComponent = icon;

  return (
    <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700 min-w-[200px]">
      <div className="bg-slate-700 p-3 rounded-md">
        <IconComponent className="text-amber-400" size={24} />
      </div>
      <div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">{title}</div>
        <div className="text-xl font-semibold text-white">{value}</div>
      </div>
    </div>
  );
};

// Sub-component: UserMenu
const UserMenu = ({ user }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-700 transition-colors"
      >
        <UserCircle2 className="text-slate-300" />
        <span className="text-sm font-medium text-slate-200 hidden sm:block">{user.role}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-20">
          <div className="p-4 border-b border-slate-700">
            <p className="font-semibold text-white">Signed in as</p>
            <p className="text-sm text-slate-400 truncate">{user.email}</p>
          </div>
          <div className="p-2">
            <div className="px-2 py-2">
              <p className="text-xs uppercase text-slate-400 mb-2">Switch Role</p>
              <RoleSwitcher />
            </div>
            <button
              onClick={() => {
                dispatch(logout());
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Header Component
export const Header = () => {
  const dispatch = useDispatch();
  const { summary, status } = useSelector((state) => state.payrollSummary);
  const { currency } = useSelector((state) => state.ui);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    dispatch(setCurrency(newCurrency));
    dispatch(fetchPayrollSummary(newCurrency));
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />

      <header className="bg-slate-900 text-white shadow-lg w-full">
        {/* TOP BAR: Logo and User Actions */}
        <div className="w-full flex justify-between items-center p-4">
          <div className="flex items-center">
            <h1 className="font-nastaliq text-4xl md:text-5xl text-amber-400" style={{ textShadow: '1px 1px 3px rgba(251, 191, 36, 0.3)' }}>
              اجرت نامہ
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <UserMenu user={user} />
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">HR Login</span>
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-slate-700 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* BOTTOM BAR: Stats and Controls */}
        {(isMenuOpen || window.innerWidth >= 768) && (
          <div className="w-full p-4 border-t border-slate-700/50">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Stats Section */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
                <InfoBox icon={Users} title="Total Headcount" value={status === 'loading' ? '...' : summary?.totalHeadCount ?? 'N/A'} />
                <InfoBox icon={Clock} title="Billable Hours/Month" value={status === 'loading' ? '...' : summary?.totalBillableHours ?? 'N/A'} />
                <InfoBox icon={CircleDollarSign} title="Monthly Burn" value={status === 'loading' ? '...' : formatCurrency(summary?.totalMonthlyCost ?? 0)} />
              </div>

              {/* Controls Section */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <select
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="p-2 border border-slate-600 rounded-md bg-slate-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="PKR">PKR</option>
                </select>

                {user?.role === 'hr' && (
                  <button
                    onClick={() => dispatch(openAddEmployeeDrawer(null))}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <PlusCircle size={18} /> Add Employee
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
