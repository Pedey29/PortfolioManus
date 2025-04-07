import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoricalData, TimePeriod } from '../types/types';

interface PerformanceChartProps {
  data: HistoricalData | null;
  isLoading: boolean;
  onPeriodChange: (period: TimePeriod) => void;
  selectedPeriod: TimePeriod;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  data, 
  isLoading, 
  onPeriodChange,
  selectedPeriod
}) => {
  const periods: TimePeriod[] = ['1W', '1M', '3M', 'YTD', '1Y', 'ALL'];

  // Format data for chart
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    // Combine portfolio and benchmark data
    const combinedData: { date: string; portfolio: number; benchmark: number }[] = [];
    
    // Get all unique dates
    const allDates = new Set<string>();
    data.portfolio.forEach(item => allDates.add(item.date));
    data.benchmark.forEach(item => allDates.add(item.date));
    
    // Sort dates
    const sortedDates = Array.from(allDates).sort();
    
    // Create combined data array
    sortedDates.forEach(date => {
      const portfolioPoint = data.portfolio.find(item => item.date === date);
      const benchmarkPoint = data.benchmark.find(item => item.date === date);
      
      combinedData.push({
        date,
        portfolio: portfolioPoint ? portfolioPoint.value : 0,
        benchmark: benchmarkPoint ? benchmarkPoint.value : 0
      });
    });
    
    return combinedData;
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded shadow-md">
        <div className="h-64 flex items-center justify-center">
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow-md">
        <div className="h-64 flex items-center justify-center">
          <p>No performance data available. Add positions to your portfolio to see performance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
      
      <div className="flex space-x-2 mb-4">
        {periods.map(period => (
          <button
            key={period}
            onClick={() => onPeriodChange(period)}
            className={`px-3 py-1 rounded ${
              selectedPeriod === period 
                ? 'bg-uww-purple text-uww-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(2)}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="portfolio"
              name="Portfolio"
              stroke="#5E2F8B" // UW-Whitewater Purple
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              name="Benchmark (SPY)"
              stroke="#000000" // UW-Whitewater Black
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
