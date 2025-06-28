// src/components/Dashboard.jsx
import { useDispatch, useSelector } from 'react-redux';
import { openAddHolidayDialog, openAddEmployeeDrawer } from '../slices/uiSlice';
import { Edit, CalendarPlus } from 'lucide-react';

export const Dashboard = () => {
    const dispatch = useDispatch();
    const { employees, status } = useSelector((state) => state.employees);
    const { user } = useSelector((state) => state.auth);

    if (status === 'loading') return <p>Loading employees...</p>;
    if (status === 'failed') return <p>Failed to load employees.</p>;

    return (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Off (This Month)</th>
                        {user?.role === 'hr' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                        <tr key={employee._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.dept}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${employee.hourlyRate.amount} ${employee.hourlyRate.currency}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {employee.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{employee.holidays.length}</td>
                            {user?.role === 'hr' && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                    <button onClick={() => dispatch(openAddEmployeeDrawer(employee))} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></button>
                                    <button onClick={() => dispatch(openAddHolidayDialog(employee))} className="text-green-600 hover:text-green-900"><CalendarPlus size={18}/></button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};