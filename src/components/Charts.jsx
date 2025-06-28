// src/components/Charts.jsx
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export const Charts = () => {
    const { summary, status } = useSelector((state) => state.payrollSummary);
    const { currency } = useSelector((state) => state.ui);

    if (status !== 'succeeded' || !summary) {
        return <div className="text-center p-8">Loading chart data...</div>;
    }

    const chartData = summary.byDept;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold mb-4 text-center">Monthly Burn by Dept ({currency})</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dept" />
                        <YAxis />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('en-US').format(value)}/>
                        <Legend />
                        <Bar dataKey="monthlyCost" fill="#8884d8" name={`Cost in ${currency}`} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold mb-4 text-center">Billable Hours by Dept</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dept" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="billableHours" stroke="#82ca9d" name="Hours" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};