import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openAddHolidayDialog, openAddEmployeeDrawer } from '../slices/uiSlice';
import {
  Edit,
  CalendarPlus,
  Search,
  ArrowUpDown,
  Loader2,
  ArrowUp,
  Download
} from 'lucide-react';

// Helper function to convert data to CSV format
const convertToCSV = (data, headers) => {
  const header = headers.join(',');
  const rows = data.map(obj =>
    headers.map(header => {
      const value = obj[header];
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value)}"`;
      }
      return `"${value}"`;
    }).join(',')
  );
  return [header, ...rows].join('\n');
};

// Helper function to download CSV file
const downloadCSV = (data, filename) => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to get initials for the avatar
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper to format currency dynamically
const formatDynamicCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// DUMMY: In a real app, these rates would come from an API.
const CONVERSION_RATES = {
  USD: { EUR: 0.93, PKR: 278.50, USD: 1 },
  EUR: { USD: 1.08, PKR: 299.50, EUR: 1 },
  PKR: { USD: 0.0036, EUR: 0.0033, PKR: 1 },
};

// Main Dashboard Component
export const Dashboard = () => {
  const dispatch = useDispatch();
  const { employees, status: employeesStatus } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);
  const { currency: selectedCurrency } = useSelector((state) => state.ui);

  // State for Filters and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  // Memoized Filtering and Sorting
  const filteredAndSortedEmployees = useMemo(() => {
    let sortableEmployees = [...employees];

    if (statusFilter !== 'all') {
      sortableEmployees = sortableEmployees.filter(e => e.status === statusFilter);
    }
    if (searchTerm) {
      sortableEmployees = sortableEmployees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      sortableEmployees.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        let comparison = 0;

        if (sortConfig.key === 'hourlyRate') {
          comparison = a.hourlyRate.amount - b.hourlyRate.amount;
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = (aValue || '').toString().localeCompare((bValue || '').toString());
        }

        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }

    return sortableEmployees;
  }, [employees, searchTerm, statusFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleExportPayroll = () => {
    const headers = ['Name', 'Email', 'Department', 'Title', 'Status', 'Hourly Rate', 'Currency', 'Total Hours', 'Total Cost'];
    const payrollData = filteredAndSortedEmployees.map(employee => {
      const totalHours = employee.holidays.reduce((acc, holiday) => {
        return acc + (holiday.kind === 'paid' ? 8 : 0);
      }, 160); // Assuming 160 hours as a base for a month
      const totalCost = totalHours * employee.hourlyRate.amount;
      return {
        'Name': employee.name,
        'Email': employee.email,
        'Department': employee.dept,
        'Title': employee.title,
        'Status': employee.status,
        'Hourly Rate': employee.hourlyRate.amount,
        'Currency': employee.hourlyRate.currency,
        'Total Hours': totalHours,
        'Total Cost': totalCost
      };
    });

    const csvData = convertToCSV(payrollData, headers);
    downloadCSV(csvData, 'payroll_data.csv');
  };

  const handleExportHolidayLog = () => {
    const headers = ['Name', 'Email', 'Holiday Date', 'Holiday Kind'];
    const holidayData = employees.flatMap(employee =>
      employee.holidays.map(holiday => ({
        'Name': employee.name,
        'Email': employee.email,
        'Holiday Date': new Date(holiday.date).toLocaleDateString(),
        'Holiday Kind': holiday.kind
      }))
    );

    const csvData = convertToCSV(holidayData, headers);
    downloadCSV(csvData, 'holiday_log.csv');
  };

  const SortableHeader = ({ tKey, title }) => (
    <th
      onClick={() => requestSort(tKey)}
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
    >
      <div className="flex items-center gap-2">
        {title}
        {sortConfig.key === tKey ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : <ArrowUpDown size={12} className="text-gray-400" />}
      </div>
    </th>
  );

  // Render Loading/Error States
  if (employeesStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-slate-500" size={48} />
        <p className="ml-4 text-lg text-slate-600">Loading Employees...</p>
      </div>
    );
  }
  if (employeesStatus === 'failed') {
    return <p className="text-center text-red-500 p-8">Failed to load employees. Please try again later.</p>;
  }

  // Component Render
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-fit">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Control Panel */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <div className="flex rounded-lg border border-gray-300">
              <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 text-sm rounded-l-md ${statusFilter === 'all' ? 'bg-amber-500 text-white' : 'bg-white hover:bg-gray-100'}`}>All</button>
              <button onClick={() => setStatusFilter('active')} className={`px-3 py-1 text-sm border-l border-r ${statusFilter === 'active' ? 'bg-amber-500 text-white' : 'bg-white hover:bg-gray-100'}`}>Active</button>
              <button onClick={() => setStatusFilter('resigned')} className={`px-3 py-1 text-sm rounded-r-md ${statusFilter === 'resigned' ? 'bg-amber-500 text-white' : 'bg-white hover:bg-gray-100'}`}>Resigned</button>
            </div>
          </div>
        </div>

        {/* Export Buttons for HR */}
        {user?.role === 'hr' && (
          <div className="p-4 flex gap-4">
            <button
              onClick={handleExportPayroll}
              className="flex items-center gap-2 border-[0.5px] border-black text-black font-light py-2 px-4 rounded-md transition-colors"
            >
              <Download size={18} /> Export Payroll
            </button>
            <button
              onClick={handleExportHolidayLog}
              className="flex items-center gap-2 border-[0.5px] border-black text-black font-light py-2 px-4 rounded-md transition-colors"
            >
              <Download size={18} /> Export Holiday Log
            </button>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader tKey="name" title="Name" />
                <SortableHeader tKey="dept" title="Department" />
                <SortableHeader tKey="title" title="Title" />
                <SortableHeader tKey="hourlyRate" title={`Hourly Rate (${selectedCurrency})`} />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Days Off</th>
                {user?.role === 'hr' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedEmployees.map((employee) => {
                const baseRate = employee.hourlyRate.amount;
                const baseCurrency = employee.hourlyRate.currency;
                const convertedRate = baseRate * (CONVERSION_RATES[baseCurrency]?.[selectedCurrency] ?? 1);
                const mostRecentRaise = employee.raises && employee.raises.length > 0 ? employee.raises[employee.raises.length - 1] : null;

                return (
                  <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">{getInitials(employee.name)}</div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.dept}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <span>{formatDynamicCurrency(convertedRate, selectedCurrency)}</span>
                        {mostRecentRaise && (
                          <div className="relative group">
                            <ArrowUp className="text-green-500" size={16} />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-800 text-white text-xs rounded-md py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              Raise: {formatDynamicCurrency(mostRecentRaise.amount, mostRecentRaise.currency)} on {new Date(mostRecentRaise.date).toLocaleDateString()}
                              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{employee.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{employee.holidays.length}</td>
                    {user?.role === 'hr' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                        <button onClick={() => dispatch(openAddEmployeeDrawer(employee))} className="text-slate-600 hover:text-amber-600" title="Edit Employee">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => dispatch(openAddHolidayDialog(employee))} className="text-slate-600 hover:text-green-600" title="Add Holiday">
                          <CalendarPlus size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden p-4 space-y-4">
          {filteredAndSortedEmployees.map(employee => {
            const baseRate = employee.hourlyRate.amount;
            const baseCurrency = employee.hourlyRate.currency;
            const convertedRate = baseRate * (CONVERSION_RATES[baseCurrency]?.[selectedCurrency] ?? 1);
            const mostRecentRaise = employee.raises && employee.raises.length > 0 ? employee.raises[employee.raises.length - 1] : null;

            return (
              <div key={employee._id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">{getInitials(employee.name)}</div>
                    <div>
                      <p className="font-bold text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.title}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{employee.status}</span>
                </div>
                <div className="border-t my-3"></div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium">{employee.dept}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Hourly Rate:</span>
                    <div className="flex items-center gap-2 font-medium">
                      <span>{formatDynamicCurrency(convertedRate, selectedCurrency)}</span>
                      {mostRecentRaise && (
                        <div className="relative group">
                          <ArrowUp className="text-green-500" size={16} />
                          <div className="absolute bottom-full right-0 mb-2 w-max bg-slate-800 text-white text-xs rounded-md py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Raise: {formatDynamicCurrency(mostRecentRaise.amount, mostRecentRaise.currency)} on {new Date(mostRecentRaise.date).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Days Off:</span>
                    <span className="font-medium">{employee.holidays.length}</span>
                  </div>
                </div>
                {user?.role === 'hr' && (
                  <>
                    <div className="border-t my-3"></div>
                    <div className="flex justify-end gap-4">
                      <button onClick={() => dispatch(openAddEmployeeDrawer(employee))} className="flex items-center gap-2 text-sm text-slate-600 hover:text-amber-600">
                        <Edit size={16} /> Edit
                      </button>
                      <button onClick={() => dispatch(openAddHolidayDialog(employee))} className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600">
                        <CalendarPlus size={16} /> Add Holiday
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / Pagination Info */}
        <div className="p-4 border-t text-sm text-gray-500">
          Showing <span className="font-medium">{filteredAndSortedEmployees.length}</span> of <span className="font-medium">{employees.length}</span> employees.
        </div>
      </div>
    </div>
  );
};
