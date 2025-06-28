// src/components/AddHolidayDialog.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAddHolidayDialog } from '../slices/uiSlice';
import { fetchEmployees } from '../slices/employeesSlice';
import { fetchPayrollSummary } from '../slices/payrollSummarySlice';
import { addHoliday } from '../lib/api';

export const AddHolidayDialog = () => {
    const dispatch = useDispatch();
    const { isAddHolidayDialogOpen, selectedEmployee, currency } = useSelector((state) => state.ui);
    const [date, setDate] = useState('');
    const [kind, setKind] = useState('unpaid');

    const handleClose = () => dispatch(closeAddHolidayDialog());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        await addHoliday({ employeeId: selectedEmployee._id, date, kind });

        // Refetch data to see changes
        dispatch(fetchEmployees());
        dispatch(fetchPayrollSummary(currency));
        handleClose();
    };

    if (!isAddHolidayDialogOpen || !selectedEmployee) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add Holiday for {selectedEmployee.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" required/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Kind</label>
                        <select value={kind} onChange={e => setKind(e.target.value)} className="w-full p-2 border rounded">
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="sick">Sick</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={handleClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Holiday</button>
                    </div>
                </form>
            </div>
        </div>
    );
};