import React, { useState, useMemo } from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Filter, Map } from 'lucide-react';

const EVDashboard = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState('all');

  const processedData = useMemo(() => {
    const filteredData = selectedYear === 'all' 
      ? data 
      : data.filter(item => item.Year === parseInt(selectedYear));

    // Model distribution
    const modelDistribution = filteredData.reduce((acc, cur) => {
      acc[cur.Model] = (acc[cur.Model] || 0) + 1;
      return acc;
    }, {});

    // Make distribution with total count and electric range
    const makeDistribution = filteredData.reduce((acc, cur) => {
      if (!acc[cur.Make]) {
        acc[cur.Make] = {
          count: 0,
          totalRange: 0,
          totalMSRP: parseFloat(cur['Base MSRP'] || 0)
        };
      }
      acc[cur.Make].count += 1;
      acc[cur.Make].totalRange += parseFloat(cur['Electric Range'] || 0);
      acc[cur.Make].totalMSRP += parseFloat(cur['Base MSRP'] || 0);
      return acc;
    }, {});

    // City distribution with electric range
    const cityDistribution = filteredData.reduce((acc, cur) => {
      if (!acc[cur.City]) {
        acc[cur.City] = {
          count: 0,
          totalRange: 0
        };
      }
      acc[cur.City].count += 1;
      acc[cur.City].totalRange += parseFloat(cur['Electric Range'] || 0);
      return acc;
    }, {});

    return {
      modelData: Object.entries(modelDistribution)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
      makeData: Object.entries(makeDistribution)
        .map(([name, data]) => ({
          name,
          count: data.count,
          averageRange: Math.round(data.totalRange / data.count),
          totalMSRP: Math.round(data.totalMSRP / 1000000) // Convert to millions
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      cityData: Object.entries(cityDistribution)
        .map(([name, data]) => ({
          name,
          totalRange: Math.round(data.totalRange),
          count: data.count
        }))
        .sort((a, b) => b.totalRange - a.totalRange)
        .slice(0, 10)
    };
  }, [data, selectedYear]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(data.map(item => item.Year))];
    return ['all', ...uniqueYears.sort()];
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Electric Vehicle Popularity Report</h1>
        <div className="flex items-center gap-4">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-lg"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year === 'all' ? 'All Years' : year}
              </option>
            ))}
          </select>
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <Filter className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <Map className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Model Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Model Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={processedData.modelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#4f46e5"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Make Distribution with MSRP */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Total Base MSRP by Make (Millions)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processedData.makeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
              <Bar dataKey="totalMSRP" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* City Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Electric Range by City</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processedData.cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
              <Bar dataKey="totalRange" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Make Average Range */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Average Range by Make</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData.makeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
              <Line type="monotone" dataKey="averageRange" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EVDashboard;