import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from './slices/employeesSlice.js';
import { fetchPayrollSummary } from './slices/payrollSummarySlice.js';

import {Header} from './components/Header.jsx';
import {Dashboard} from './components/Dashboard.jsx';
import {Charts} from './components/Charts.jsx';
import {AddEmployeeDrawer} from './components/AddEmployeeDrawer.jsx';
import {AddHolidayDialog} from './components/AddHolidayDialog';

function App() {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.ui.currency);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchPayrollSummary(currency));
  }, [dispatch, currency]);

  return (
    <div className="bg-gray-100 w-full m-0 min-h-screen p-0 md:p-0">
      <div className="container mx-auto space-y-8">
        <Header />
        <main>
          <Dashboard />
          <Charts />
        </main>
      </div>
      <AddEmployeeDrawer />
      <AddHolidayDialog />
    </div>
  );
}

export default App;
