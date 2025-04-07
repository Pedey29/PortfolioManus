import React, { useState, useEffect } from 'react';
import './App.css';
import { usePortfolio } from './hooks/usePortfolio';
import { fetchMultiplePrices, calculatePortfolioPerformance } from './utils/apiService';
import { initializeSampleData } from './utils/sampleData';
import { TimePeriod, HistoricalData } from './types/types';
import PositionList from './components/PositionList';
import AddPositionForm from './components/AddPositionForm';
import PerformanceChart from './components/PerformanceChart';
import AdminSection from './components/AdminSection';

function App() {
  // Initialize sample data if localStorage is empty
  useEffect(() => {
    initializeSampleData();
  }, []);

  // Get portfolio data from localStorage
  const { 
    positions, 
    totalValue, 
    isLoading, 
    error,
    addPosition,
    removePosition,
    updatePositionPrices,
    clearPortfolio
  } = usePortfolio();

  // State for benchmark and performance data
  const [benchmark, setBenchmark] = useState<string>(() => {
    return localStorage.getItem('benchmark') || 'SPY';
  });
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');
  const [performanceData, setPerformanceData] = useState<HistoricalData | null>(null);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch current prices on initial load
  useEffect(() => {
    if (positions.length > 0) {
      fetchLatestPrices();
    }
  }, [positions.length]);

  // Fetch performance data when period changes
  useEffect(() => {
    if (positions.length > 0) {
      fetchPerformanceData();
    }
  }, [selectedPeriod, benchmark, positions.length]);

  // Fetch latest prices for all positions
  const fetchLatestPrices = async () => {
    setStatusMessage('Fetching latest prices...');
    const symbols = positions.map(position => position.symbol);
    const priceData = await fetchMultiplePrices(symbols);
    updatePositionPrices(priceData);
    setStatusMessage('Prices updated successfully');
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  // Fetch performance data
  const fetchPerformanceData = async () => {
    if (positions.length === 0) return;
    
    setIsLoadingPerformance(true);
    setStatusMessage('Fetching performance data...');
    
    try {
      const result = await calculatePortfolioPerformance(positions, benchmark, selectedPeriod);
      if (result.success && result.data) {
        setPerformanceData(result.data);
      } else {
        console.error('Failed to fetch performance data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoadingPerformance(false);
      setStatusMessage(null);
    }
  };

  // Change benchmark symbol
  const handleChangeBenchmark = (symbol: string) => {
    setBenchmark(symbol);
    localStorage.setItem('benchmark', symbol);
    setStatusMessage(`Benchmark changed to ${symbol}`);
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-uww-black">
      <header className="bg-uww-purple text-uww-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Applied Investment Program Portfolio Tracker</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {statusMessage && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
            {statusMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Portfolio Summary</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                </div>
              </div>
              
              <AddPositionForm onAddPosition={addPosition} />
              
              <PositionList 
                positions={positions} 
                onRemovePosition={removePosition} 
                isLoading={isLoading} 
              />
            </div>
            
            <PerformanceChart 
              data={performanceData}
              isLoading={isLoadingPerformance}
              onPeriodChange={setSelectedPeriod}
              selectedPeriod={selectedPeriod}
            />
          </div>
          
          <div>
            <AdminSection 
              onChangeBenchmark={handleChangeBenchmark}
              onUpdatePrices={fetchLatestPrices}
              onClearPortfolio={clearPortfolio}
              currentBenchmark={benchmark}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-uww-purple text-uww-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>Applied Investment Program Portfolio Tracker</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
