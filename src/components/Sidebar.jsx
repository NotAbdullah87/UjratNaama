import React, { useState } from 'react';
import { FiBarChart2, FiUsers, FiCalendar, FiMenu, FiX } from 'react-icons/fi';

const Sidebar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-full"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar for Desktop */}
      <div className={`hidden md:block fixed top-0 left-0 h-full bg-slate-900 text-white backdrop-blur-md transition-all duration-300 ease-in-out z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <h2 className="text-xl font-bold pt-20">{isOpen ? 'Menu' : ''}</h2>
          <nav className="mt-6">
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors w-full text-left"
                >
                  <FiBarChart2 className="mr-3" />
                  {isOpen && <span>Dashboard</span>}
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => onNavigate('employees')}
                  className="flex items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors w-full text-left"
                >
                  <FiUsers className="mr-3" />
                  {isOpen && <span>Employees</span>}
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => onNavigate('holidays')}
                  className="flex items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors w-full text-left"
                >
                  <FiCalendar className="mr-3" />
                  {isOpen && <span>Holidays</span>}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Drawer for Mobile */}
      {isOpen && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-white  z-40 border-t border-slate-700">
          <div className="p-4">
            <nav>
              <ul className="flex justify-around">
                <li>
                  <button
                    onClick={() => { onNavigate('dashboard'); toggleSidebar(); }}
                    className="flex flex-col items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                  >
                    <FiBarChart2 className="text-2xl" />
                    <span className="text-xs">Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { onNavigate('employees'); toggleSidebar(); }}
                    className="flex flex-col items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                  >
                    <FiUsers className="text-2xl" />
                    <span className="text-xs">Employees</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { onNavigate('holidays'); toggleSidebar(); }}
                    className="flex flex-col items-center p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                  >
                    <FiCalendar className="text-2xl" />
                    <span className="text-xs">Holidays</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
