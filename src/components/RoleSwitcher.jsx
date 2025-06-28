// src/components/RoleSwitcher.jsx
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '../slices/authSlice';

export const RoleSwitcher = () => {
  const dispatch = useDispatch();
  const currentRole = useSelector((state) => state.auth.user?.role);

  const handleRoleChange = (event) => {
    dispatch(setRole(event.target.value));
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="role-select" className="text-sm font-medium">Role:</label>
      <select
        id="role-select"
        value={currentRole}
        onChange={handleRoleChange}
        className="p-2 border rounded-md bg-gray-700 text-white"
      >
        <option value="hr">HR</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  );
};