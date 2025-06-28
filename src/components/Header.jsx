// src/components/Header.jsx
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency, openAddEmployeeDrawer } from '../slices/uiSlice';
import { fetchPayrollSummary } from '../slices/payrollSummarySlice';
import { RoleSwitcher } from './RoleSwitcher.jsx';
import { PlusCircle } from 'lucide-react';

export const Header = () => {
  const dispatch = useDispatch();
  const { summary, status } = useSelector((state) => state.payrollSummary);
  const { currency } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    dispatch(setCurrency(newCurrency));
    dispatch(fetchPayrollSummary(newCurrency));
  };
  
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  return (
    <header className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">PayScope Dashboard</h1>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="text-center">
            <div className="text-sm text-gray-400">Total Headcount</div>
            <div className="text-xl font-semibold">{status === 'loading' ? '...' : summary?.totalHeadCount ?? 'N/A'}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Billable Hours/Month</div>
            <div className="text-xl font-semibold">{status === 'loading' ? '...' : summary?.totalBillableHours ?? 'N/A'}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Monthly Burn</div>
            <div className="text-xl font-semibold">{status === 'loading' ? '...' : formatCurrency(summary?.totalMonthlyCost ?? 0)}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <RoleSwitcher />
          <select value={currency} onChange={handleCurrencyChange} className="p-2 border rounded-md bg-gray-700 text-white">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="PKR">PKR</option>
          </select>
          {user?.role === 'hr' && (
             <button onClick={() => dispatch(openAddEmployeeDrawer(null))} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
                <PlusCircle size={18} /> Add Employee
             </button>
          )}
        </div>
      </div>
    </header>
  );
};