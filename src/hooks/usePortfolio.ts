import { useEffect, useState } from 'react';
import { StockPosition } from '../types/types';

// Custom hook for managing portfolio data in localStorage
export const usePortfolio = () => {
  const [positions, setPositions] = useState<StockPosition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState<number>(0);

  // Load positions from localStorage
  useEffect(() => {
    try {
      setIsLoading(true);
      const storedPositions = localStorage.getItem('portfolioPositions');
      if (storedPositions) {
        setPositions(JSON.parse(storedPositions));
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load portfolio data');
      setIsLoading(false);
    }
  }, []);

  // Calculate total portfolio value whenever positions change
  useEffect(() => {
    const total = positions.reduce((sum, position) => sum + position.currentValue, 0);
    setTotalValue(total);
    
    // Update position weights based on new total
    if (total > 0) {
      const updatedPositions = positions.map(position => ({
        ...position,
        weight: (position.currentValue / total) * 100
      }));
      
      // Only update if weights have changed
      if (JSON.stringify(updatedPositions) !== JSON.stringify(positions)) {
        setPositions(updatedPositions);
        savePositions(updatedPositions);
      }
    }
  }, [positions]);

  // Save positions to localStorage
  const savePositions = (updatedPositions: StockPosition[]) => {
    try {
      localStorage.setItem('portfolioPositions', JSON.stringify(updatedPositions));
    } catch (err) {
      setError('Failed to save portfolio data');
    }
  };

  // Add a new position
  const addPosition = (position: Omit<StockPosition, 'id' | 'currentPrice' | 'currentValue' | 'weight' | 'weeklyChange' | 'totalReturn'>) => {
    try {
      const newPosition: StockPosition = {
        ...position,
        id: Date.now().toString(), // Generate a unique ID
        currentPrice: 0,
        currentValue: 0,
        weight: 0,
        weeklyChange: 0,
        totalReturn: 0
      };
      
      const updatedPositions = [...positions, newPosition];
      setPositions(updatedPositions);
      savePositions(updatedPositions);
      return true;
    } catch (err) {
      setError('Failed to add position');
      return false;
    }
  };

  // Remove a position
  const removePosition = (id: string) => {
    try {
      const updatedPositions = positions.filter(position => position.id !== id);
      setPositions(updatedPositions);
      savePositions(updatedPositions);
      return true;
    } catch (err) {
      setError('Failed to remove position');
      return false;
    }
  };

  // Update positions with current price data
  const updatePositionPrices = (priceData: Record<string, number>) => {
    try {
      const updatedPositions = positions.map(position => {
        const currentPrice = priceData[position.symbol] || position.currentPrice;
        const currentValue = currentPrice * position.shares;
        const totalReturn = ((currentPrice - position.purchasePrice) / position.purchasePrice) * 100;
        
        return {
          ...position,
          currentPrice,
          currentValue,
          totalReturn
        };
      });
      
      setPositions(updatedPositions);
      savePositions(updatedPositions);
      return true;
    } catch (err) {
      setError('Failed to update position prices');
      return false;
    }
  };

  // Clear all positions
  const clearPortfolio = () => {
    try {
      setPositions([]);
      localStorage.removeItem('portfolioPositions');
      return true;
    } catch (err) {
      setError('Failed to clear portfolio');
      return false;
    }
  };

  return {
    positions,
    totalValue,
    isLoading,
    error,
    addPosition,
    removePosition,
    updatePositionPrices,
    clearPortfolio
  };
};
