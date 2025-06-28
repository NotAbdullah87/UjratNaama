// Updated: src/components/AddEmployeeDrawer.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAddEmployeeDrawer } from '../slices/uiSlice';
import { createEmployee, updateEmployee, deleteEmployee } from '../lib/api';
import { fetchEmployees } from '../slices/employeesSlice';
import { Trash2, Save, X, UserPlus, Edit } from 'lucide-react';

export const AddEmployeeDrawer = () => {
  const dispatch = useDispatch();
  const { isAddEmployeeDrawerOpen, selectedEmployee } = useSelector((state) => state.ui);
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dept: '',
    title: '',
    status: 'active',
    hourlyRate: 0
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        dept: selectedEmployee.dept,
        title: selectedEmployee.title,
        status: selectedEmployee.status,
        hourlyRate: selectedEmployee.hourlyRate?.amount || 0,
      });
    } else {
      setFormData({ name: '', email: '', dept: '', title: '', status: 'active', hourlyRate: 0 });
    }
  }, [selectedEmployee]);

  const handleClose = () => dispatch(closeAddEmployeeDrawer());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee._id, {
        status: formData.status,
        hourlyRate: { amount: formData.hourlyRate, currency: 'USD' },
      }, token);
    } else {
      console.log(formData)
      await createEmployee({
        name: formData.name,
        email: formData.email,
        dept: formData.dept,
        title: formData.title,
        status: formData.status,
        hourlyRate: formData.hourlyRate,
        hireDate: new Date().toISOString().split('T')[0]
      }, token);
    }
    dispatch(fetchEmployees());
    handleClose();
  };

  const confirmDelete = () => setShowDeleteConfirm(true);
  const cancelDelete = () => setShowDeleteConfirm(false);
  const handleDelete = async () => {
    if (selectedEmployee) {
      await deleteEmployee(selectedEmployee._id, token);
      dispatch(fetchEmployees());
      handleClose();
    }
  };

  if (!isAddEmployeeDrawerOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full md:w-1/3 h-full p-6 shadow-xl overflow-y-auto relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2 mb-6">
          {selectedEmployee ? <Edit size={24} className="text-blue-600" /> : <UserPlus size={24} className="text-green-600" />}
          <h2 className="text-2xl font-bold">
            {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!selectedEmployee && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input type="text" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" required />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border rounded">
              <option value="active">Active</option>
              <option value="resigned">Resigned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hourly Rate (USD)</label>
            <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})} className="w-full p-2 border rounded" required />
          </div>

          <div className="flex justify-between gap-4 pt-6">
            {selectedEmployee && (
              <button type="button" onClick={confirmDelete} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                <Trash2 size={18} /> Delete
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button type="button" onClick={handleClose} className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                <X size={18} /> Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this employee?</p>
              <div className="flex justify-end gap-3">
                <button onClick={cancelDelete} className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
