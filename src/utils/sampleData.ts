import { StockPosition } from '../types/types';

// Sample data for initial testing
export const samplePositions: StockPosition[] = [
  {
    id: '1',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    shares: 10,
    purchasePrice: 175.25,
    purchaseDate: '2023-01-15',
    sector: 'Technology',
    currentPrice: 0, // Will be updated from API
    currentValue: 0, // Will be calculated
    weight: 0, // Will be calculated
    weeklyChange: 0, // Will be calculated
    totalReturn: 0, // Will be calculated
  },
  {
    id: '2',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    shares: 5,
    purchasePrice: 320.75,
    purchaseDate: '2023-02-10',
    sector: 'Technology',
    currentPrice: 0,
    currentValue: 0,
    weight: 0,
    weeklyChange: 0,
    totalReturn: 0,
  },
  {
    id: '3',
    symbol: 'JNJ',
    companyName: 'Johnson & Johnson',
    shares: 8,
    purchasePrice: 165.50,
    purchaseDate: '2023-03-05',
    sector: 'Healthcare',
    currentPrice: 0,
    currentValue: 0,
    weight: 0,
    weeklyChange: 0,
    totalReturn: 0,
  },
  {
    id: '4',
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    shares: 7,
    purchasePrice: 145.80,
    purchaseDate: '2023-04-20',
    sector: 'Financial Services',
    currentPrice: 0,
    currentValue: 0,
    weight: 0,
    weeklyChange: 0,
    totalReturn: 0,
  },
  {
    id: '5',
    symbol: 'PG',
    companyName: 'Procter & Gamble Co.',
    shares: 12,
    purchasePrice: 152.30,
    purchaseDate: '2023-05-15',
    sector: 'Consumer Defensive',
    currentPrice: 0,
    currentValue: 0,
    weight: 0,
    weeklyChange: 0,
    totalReturn: 0,
  }
];

// Function to initialize localStorage with sample data if empty
export const initializeSampleData = (): void => {
  const existingData = localStorage.getItem('portfolioPositions');
  if (!existingData) {
    localStorage.setItem('portfolioPositions', JSON.stringify(samplePositions));
  }
  
  // Set default benchmark if not already set
  const benchmark = localStorage.getItem('benchmark');
  if (!benchmark) {
    localStorage.setItem('benchmark', 'SPY');
  }
};

// Function to clear sample data
export const clearSampleData = (): void => {
  localStorage.removeItem('portfolioPositions');
  // Don't remove benchmark setting
};
