import React, { useState, useMemo } from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Filter, Map } from 'lucide-react';

const EVDashboard = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState('all');
  
    // Array of colors for the pie chart segments
    const COLORS = [
      '#FF6B6B', // coral red
      '#4ECDC4', // turquoise
      '#45B7D1', // sky blue
      '#96CEB4', // sage green
      '#FFEEAD', // cream yellow
      '#D4A5A5', // dusty rose
      '#9B5DE5', // purple
      '#F15BB5', // pink
      '#00BBF9', // bright blue
      '#00F5D4'  // mint
    ];
  
   
    
  const processedData = useMemo(() => {
    const filteredData = selectedYear === 'all' 
      ? data 
      : data.filter(item => {
          const itemYear = String(item['Model Year']).trim();
          return itemYear === String(selectedYear).trim();
        });

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

    // MSRP by Make calculation
    const msrpByMake = filteredData.reduce((acc, cur) => {
      const make = cur.Make;
      const msrp = parseFloat(cur['Base MSRP'] || 0);
      if (!acc[make]) {
        acc[make] = 0;
      }
      acc[make] += msrp;
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
          totalMSRP: Math.round(data.totalMSRP / 1000000)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      cityData: Object.entries(cityDistribution)
        .map(([name, data]) => ({
          name,
          totalRange: Math.round(data.totalRange / 1000),  // Convert to thousands
          count: data.count
        }))
        .sort((a, b) => b.totalRange - a.totalRange)
        .slice(0, 10),
      msrpData: Object.entries(msrpByMake)
        .map(([name, total]) => ({
          name,
          value: Math.round(total / 1000000)
        }))
        .sort((a, b) => b.value - a.value)
    };
  }, [data, selectedYear]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(data.map(item => {
      const year = String(item['Model Year']).trim();
      return year;
    }))].filter(year => year && !isNaN(year));
    return ['all', ...uniqueYears.sort((a, b) => Number(a) - Number(b))];
  }, [data]);
    
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Electric Vehicle Popularity Dashboard</h1>
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
            {/* <button className="p-2 hover:bg-gray-800 rounded-full">
              <Filter className="w-6 h-6" />
            </button> */}
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <Map className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
              {/* Model Distribution */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Vehicle Model Distribution</h2>
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
                >
                  {processedData.modelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
      
    
        {/* Make Distribution with MSRP */}
        <div className="bg-gray-800 p-6 rounded-lg">
  <h2 className="text-lg font-semibold mb-4 text-white">Sum of Base MSRP by Make</h2>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={processedData.msrpData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
      <XAxis 
        dataKey="name" 
        angle={-45} 
        textAnchor="end" 
        height={60} 
        stroke="#fff"
        interval={0}
        tick={{ fill: '#fff', fontSize: 12 }}
      />
      <YAxis 
        stroke="#fff"
        tickFormatter={(value) => `${value}M`}
        tick={{ fill: '#fff', fontSize: 12 }}
      />
      <Tooltip 
        contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
        formatter={(value) => [`${value}M`, 'Base MSRP']}
        labelStyle={{ color: '#fff' }}
      />
      <Bar 
        dataKey="value" 
        fill="#ff6b6b"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

        {/* City Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Sum of Electric Range by City</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={processedData.cityData}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
              <XAxis 
                type="number"
                stroke="#fff"
                tickFormatter={(value) => `${value}M`}
                tick={{ fill: '#fff', fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="#fff"
                tick={{ fill: '#fff', fontSize: 12 }}
                width={100}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                formatter={(value) => [`${value}M`, 'Electric Range']}
                labelStyle={{ color: '#fff' }}
              />
              <Bar 
                dataKey="totalRange" 
                fill="#FFD700"
                radius={[0, 4, 4, 0]}
              />
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