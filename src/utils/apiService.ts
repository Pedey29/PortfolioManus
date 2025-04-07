import { StockPosition, ApiResponse } from '../types/types';

// Alpha Vantage API key from environment variable
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

// Get current stock price
export const fetchCurrentPrice = async (symbol: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      return { success: false, error: data['Error Message'] };
    }
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']);
      return { success: true, data: price };
    } else {
      return { success: false, error: 'Price data not found' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Fetch multiple stock prices
export const fetchMultiplePrices = async (symbols: string[]): Promise<Record<string, number>> => {
  const result: Record<string, number> = {};
  
  // Due to API rate limits, we need to fetch one at a time
  for (const symbol of symbols) {
    try {
      const response = await fetchCurrentPrice(symbol);
      if (response.success && response.data) {
        result[symbol] = response.data;
      }
      // Add a small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1200));
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
    }
  }
  
  return result;
};

// Fetch historical data for a symbol
export const fetchHistoricalData = async (symbol: string, outputSize: 'compact' | 'full' = 'compact'): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=${outputSize}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      return { success: false, error: data['Error Message'] };
    }
    
    if (data['Time Series (Daily)']) {
      return { success: true, data: data['Time Series (Daily)'] };
    } else {
      return { success: false, error: 'Historical data not found' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Calculate portfolio performance over time
export const calculatePortfolioPerformance = async (
  positions: StockPosition[], 
  benchmarkSymbol: string,
  timePeriod: string
): Promise<ApiResponse> => {
  try {
    // Fetch historical data for benchmark
    const benchmarkResponse = await fetchHistoricalData(benchmarkSymbol);
    if (!benchmarkResponse.success) {
      return benchmarkResponse;
    }
    
    // Fetch historical data for each position
    const positionsData: Record<string, any> = {};
    for (const position of positions) {
      const response = await fetchHistoricalData(position.symbol);
      if (response.success && response.data) {
        positionsData[position.symbol] = response.data;
      }
      // Add a small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    
    // Process data based on time period
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timePeriod) {
      case '1W':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'YTD':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case 'ALL':
        // Use all available data
        startDate = new Date(0);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1); // Default to 1M
    }
    
    // Format dates for comparison
    const startDateStr = startDate.toISOString().split('T')[0];
    
    // Calculate portfolio and benchmark performance
    const portfolioPerformance: { date: string; value: number }[] = [];
    const benchmarkPerformance: { date: string; value: number }[] = [];
    
    const benchmarkData = benchmarkResponse.data;
    const dates = Object.keys(benchmarkData).sort();
    
    // Find benchmark starting value
    let benchmarkStartValue = 0;
    for (const date of dates) {
      if (date >= startDateStr) {
        benchmarkStartValue = parseFloat(benchmarkData[date]['4. close']);
        break;
      }
    }
    
    if (benchmarkStartValue === 0) {
      return { success: false, error: 'Could not determine benchmark starting value' };
    }
    
    // Find initial portfolio value for percentage calculations
    let initialPortfolioValue = 0;
    let firstDate = '';
    
    // Find the first date where we have data for all positions
    for (const date of dates) {
      if (date >= startDateStr) {
        let datePortfolioValue = 0;
        let allPositionsHaveData = true;
        
        for (const position of positions) {
          const positionData = positionsData[position.symbol];
          if (positionData && positionData[date]) {
            const price = parseFloat(positionData[date]['4. close']);
            
            // Check if position was purchased before or on this date
            if (position.purchaseDate <= date) {
              datePortfolioValue += price * position.shares;
            }
          } else {
            allPositionsHaveData = false;
          }
        }
        
        if (allPositionsHaveData && datePortfolioValue > 0) {
          initialPortfolioValue = datePortfolioValue;
          firstDate = date;
          break;
        }
      }
    }
    
    if (initialPortfolioValue === 0) {
      return { success: false, error: 'Could not determine initial portfolio value' };
    }
    
    // Calculate performance for each date
    for (const date of dates) {
      if (date >= firstDate) {
        // Calculate benchmark performance
        const benchmarkValue = parseFloat(benchmarkData[date]['4. close']);
        const benchmarkPercentChange = ((benchmarkValue / benchmarkStartValue) - 1) * 100;
        
        benchmarkPerformance.push({
          date,
          value: benchmarkPercentChange
        });
        
        // Calculate portfolio value for this date
        let datePortfolioValue = 0;
        for (const position of positions) {
          const positionData = positionsData[position.symbol];
          if (positionData && positionData[date]) {
            const price = parseFloat(positionData[date]['4. close']);
            
            // Check if position was purchased before or on this date
            if (position.purchaseDate <= date) {
              datePortfolioValue += price * position.shares;
            }
          }
        }
        
        // Calculate portfolio percent change relative to initial value
        if (datePortfolioValue > 0) {
          const portfolioPercentChange = ((datePortfolioValue / initialPortfolioValue) - 1) * 100;
          portfolioPerformance.push({
            date,
            value: portfolioPercentChange
          });
        }
      }
    }
    
    return {
      success: true,
      data: {
        portfolio: portfolioPerformance,
        benchmark: benchmarkPerformance
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
