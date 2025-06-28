// src/components/AddEmployeeDrawer.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAddEmployeeDrawer } from '../slices/uiSlice';
import { createEmployee, updateEmployee } from '../lib/api';
import { fetchEmployees } from '../slices/employeesSlice';

export const AddEmployeeDrawer = () => {
  const dispatch = useDispatch();
  const { isAddEmployeeDrawerOpen, selectedEmployee } = useSelector((state) => state.ui);
  const [formData, setFormData] = useState({
      name: '', dept: '', title: '', status: 'active', hourlyRate: 0
  });

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name,
        dept: selectedEmployee.dept,
        title: selectedEmployee.title,
        status: selectedEmployee.status,
        hourlyRate: selectedEmployee.hourlyRate.amount,
      });
    } else {
      setFormData({ name: '', dept: '', title: '', status: 'active', hourlyRate: 0 });
    }
  }, [selectedEmployee]);

  const handleClose = () => dispatch(closeAddEmployeeDrawer());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedEmployee) {
        await updateEmployee(selectedEmployee._id, formData);
    } else {
        await createEmployee(formData);
    }
    dispatch(fetchEmployees());
    handleClose();
  };

  if (!isAddEmployeeDrawerOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      <div className="bg-white w-full md:w-1/3 h-full p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">{selectedEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Department</label>
            <input type="text" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full p-2 border rounded" required />
          </div>
           <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Hourly Rate (USD)</label>
            <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})} className="w-full p-2 border rounded" required />
          </div>
           <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={handleClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};