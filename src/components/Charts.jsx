import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ChevronDown, Calendar } from 'lucide-react';

export const Charts = () => {
  const { summary, status } = useSelector((state) => state.payrollSummary);
  const { currency } = useSelector((state) => state.ui);

  const [selectedMonth, setSelectedMonth] = React.useState('Current');
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = React.useState(false);

  const availableMonths = ['Current', 'Last Month', '2 Months Ago'];

  const chartData = useMemo(() => {
    if (status !== 'succeeded' || !summary) {
      return [];
    }
    return summary.byDept.map(d => ({
      ...d,
      costPerBillableHour: d.billableHours > 0 ? (d.monthlyCost / d.billableHours).toFixed(2) : 0,
    }));
  }, [summary, status, selectedMonth]);

  if (status !== 'succeeded' || !summary) {
    return <div className="text-center p-8">Loading chart data...</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

//   const ForecastPanel = () => {
//     const INFLATION_RATE = 0.03;
//     const forecast = [];
//     let lastMonthCost = summary.totalMonthlyCost;

//     for (let i = 1; i <= 3; i++) {
//       lastMonthCost *= (1 + INFLATION_RATE);
//       forecast.push({
//         month: `Month ${i}`,
//         cost: lastMonthCost.toFixed(0),
//       });
//     }

//     return (
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h3 className="font-bold text-lg mb-4 text-center text-gray-700">3-Month Burn Forecast</h3>
//         <p className="text-center text-sm text-gray-500 mb-4">(Assuming 3% monthly inflation)</p>
//         <div className="space-y-4">
//           {forecast.map((item) => (
//             <div key={item.month} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
//               <span className="font-medium text-gray-600">{item.month}</span>
//               <span className="font-bold text-indigo-600">
//                 {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(item.cost)}
//               </span>
//             </div>
//           ))}
//         </div>
//         <div className="mt-6 pt-4 border-t border-gray-200 text-center">
//           <p className="text-sm text-gray-600">Current Monthly Cost:</p>
//           <p className="font-bold text-2xl text-gray-800">
//             {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(summary.totalMonthlyCost)}
//           </p>
//         </div>
//       </div>
//     );
//   };


const ForecastPanel = () => {
    const INFLATION_RATE = 0.03;
    const forecast = [];
    let lastMonthCost = summary.totalMonthlyCost;
  
    // Generate forecast data
    for (let i = 1; i <= 3; i++) {
      lastMonthCost *= (1 + INFLATION_RATE);
      forecast.push({
        month: `Month ${i}`,
        cost: parseFloat(lastMonthCost.toFixed(2)),
      });
    }
  
    // Prepare data for the line chart
    const chartData = forecast.map(item => ({
      name: item.month,
      Cost: item.cost,
    }));
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="font-bold text-lg mb-4 text-center text-gray-700">3-Month Burn Forecast</h3>
        <p className="text-center text-sm text-gray-500 mb-4">(Assuming 3% monthly inflation)</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value), 'Cost']} />
            <Legend />
            <Line type="monotone" dataKey="Cost" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">Current Monthly Cost:</p>
          <p className="font-bold text-2xl text-gray-800">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(summary.totalMonthlyCost)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-end">
          <div className="relative">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex items-center justify-between bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-48"
            >
              <Calendar className="w-5 h-5 mr-2 text-gray-400" />
              <span>{selectedMonth}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isMonthDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isMonthDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                {availableMonths.map((month) => (
                  <a
                    key={month}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedMonth(month);
                      setIsMonthDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white"
                  >
                    {month}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-center text-gray-700">Monthly Cost by Dept ({currency})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dept" tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
                <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(value)} />
                <Bar dataKey="monthlyCost" fill="#4f46e5" name={`Cost in ${currency}`} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-center text-gray-700">Billable Hours by Dept</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" tick={{ fill: '#6B7280' }} />
                  <YAxis tick={{ fill: '#6B7280' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="billableHours" stroke="#10b981" strokeWidth={2} name="Hours" dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-center text-gray-700">Headcount Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="headCount"
                    nameKey="dept"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} employees`, name]} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-center text-gray-700">Cost per Billable Hour ({currency})</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" tick={{ fill: '#6B7280' }} />
                  <YAxis tick={{ fill: '#6B7280' }} tickFormatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(value)} />
                  <Tooltip formatter={(value) => [new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value), 'Cost per hour']} />
                  <Area type="monotone" dataKey="costPerBillableHour" stroke="#8884d8" fillOpacity={1} fill="url(#colorCost)" name="Cost per Billable Hour" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ForecastPanel />
        </div>
      </div>
    </div>
  );
};
