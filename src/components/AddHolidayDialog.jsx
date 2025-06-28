// src/components/AddHolidayDialog.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAddHolidayDialog } from '../slices/uiSlice';
import { fetchEmployees } from '../slices/employeesSlice';
import { fetchPayrollSummary } from '../slices/payrollSummarySlice';
import { addHoliday, deleteHoliday } from '../lib/api';
import { Trash2 } from 'lucide-react';

export const AddHolidayDialog = () => {
  const dispatch = useDispatch();
  const { isAddHolidayDialogOpen, selectedEmployee, currency } = useSelector((state) => state.ui);
  const { token } = useSelector((state) => state.auth);

  const [date, setDate] = useState('');
  const [kind, setKind] = useState('unpaid');
  const [loading, setLoading] = useState(false);

  const handleClose = () => dispatch(closeAddHolidayDialog());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setLoading(true);
    await addHoliday({ employeeId: selectedEmployee._id, date, kind }, token);

    dispatch(fetchEmployees());
    dispatch(fetchPayrollSummary(currency));
    setDate('');
    setKind('unpaid');
    setLoading(false);
  };

  const handleDeleteHoliday = async (holidayId) => {
    if (!holidayId || !token) return;

    await deleteHoliday(holidayId, token);
    dispatch(fetchEmployees());
    dispatch(fetchPayrollSummary(currency));
  };

  if (!isAddHolidayDialogOpen || !selectedEmployee) return null;

  const holidays = selectedEmployee.holidays || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center font-sans">
      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Holiday for {selectedEmployee.name}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kind</label>
            <select
              value={kind}
              onChange={e => setKind(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="sick">Sick</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? 'Adding...' : 'Add Holiday'}
            </button>
          </div>
        </form>

        {/* List of holidays */}
        {holidays.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Previous Holidays</h3>
            <ul className="space-y-3 max-h-52 overflow-y-auto">
              {holidays.map((holiday) => (
                <li
                  key={holiday._id}
                  className="flex items-center justify-between bg-gray-100 rounded px-4 py-2"
                >
                  <span className="text-sm text-gray-700">
                    {new Date(holiday.date).toLocaleDateString()} — <span className="capitalize">{holiday.kind}</span>
                  </span>
                  <button
                    onClick={() => handleDeleteHoliday(holiday._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Holiday"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
