export interface StockPosition {
  id: string;
  symbol: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
  sector: string;
  currentPrice: number;
  currentValue: number;
  weight: number;
  weeklyChange: number;
  totalReturn: number;
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export interface HistoricalData {
  portfolio: HistoricalDataPoint[];
  benchmark: HistoricalDataPoint[];
}

export type TimePeriod = '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL';

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
