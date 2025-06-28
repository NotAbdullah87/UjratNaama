import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from './slices/employeesSlice.js';
import { fetchPayrollSummary } from './slices/payrollSummarySlice.js';
import { Header } from './components/Header.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { Charts } from './components/Charts.jsx';
import { AddEmployeeDrawer } from './components/AddEmployeeDrawer.jsx';
import { AddHolidayDialog } from './components/AddHolidayDialog.jsx';
import Sidebar from './components/Sidebar.jsx';

function App() {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.ui.currency);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchPayrollSummary(currency));
  }, [dispatch, currency]);

  const renderView = () => {
    switch (activeView) {
      case 'employees':
        return <div>Employees View</div>;
      case 'holidays':
        return <div>Holidays View</div>;
      default:
        return (
          <>
            <Dashboard />
            <Charts />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onNavigate={setActiveView} />
      <div className="flex-1 max-sm:ml-0 ml-12 flex flex-col overflow-hidden">
        <div className="max-sm:ml-0 ml-6">
        <Header />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {renderView()}
        </main>
        <AddEmployeeDrawer />
        <AddHolidayDialog />
      </div>
    </div>
  );
}

export default App;
