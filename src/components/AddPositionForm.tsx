import React, { useState } from 'react';
import { StockPosition } from '../types/types';

interface AddPositionFormProps {
  onAddPosition: (position: Omit<StockPosition, 'id' | 'currentPrice' | 'currentValue' | 'weight' | 'weeklyChange' | 'totalReturn'>) => boolean;
}

const AddPositionForm: React.FC<AddPositionFormProps> = ({ onAddPosition }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    companyName: '',
    shares: '',
    purchasePrice: '',
    purchaseDate: '',
    sector: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.symbol || !formData.companyName || !formData.shares || !formData.purchasePrice || !formData.purchaseDate || !formData.sector) {
      setError('All fields are required');
      return;
    }

    const shares = parseFloat(formData.shares);
    const purchasePrice = parseFloat(formData.purchasePrice);

    if (isNaN(shares) || shares <= 0) {
      setError('Shares must be a positive number');
      return;
    }

    if (isNaN(purchasePrice) || purchasePrice <= 0) {
      setError('Purchase price must be a positive number');
      return;
    }

    const success = onAddPosition({
      symbol: formData.symbol.toUpperCase(),
      companyName: formData.companyName,
      shares,
      purchasePrice,
      purchaseDate: formData.purchaseDate,
      sector: formData.sector
    });

    if (success) {
      // Reset form
      setFormData({
        symbol: '',
        companyName: '',
        shares: '',
        purchasePrice: '',
        purchaseDate: '',
        sector: ''
      });
      setIsFormOpen(false);
    } else {
      setError('Failed to add position');
    }
  };

  return (
    <div className="mb-6">
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-uww-purple hover:bg-purple-700 text-uww-white font-bold py-2 px-4 rounded"
        >
          Add New Position
        </button>
      ) : (
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New Position</h3>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symbol">
                  Symbol
                </label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="AAPL"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Apple Inc."
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shares">
                  Shares
                </label>
                <input
                  type="number"
                  id="shares"
                  name="shares"
                  value={formData.shares}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="10"
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchasePrice">
                  Purchase Price
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="150.00"
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchaseDate">
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sector">
                  Sector
                </label>
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Sector</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Consumer Defensive">Consumer Defensive</option>
                  <option value="Consumer Cyclical">Consumer Cyclical</option>
                  <option value="Industrials">Industrials</option>
                  <option value="Energy">Energy</option>
                  <option value="Basic Materials">Basic Materials</option>
                  <option value="Communication Services">Communication Services</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-uww-purple hover:bg-purple-700 text-uww-white font-bold py-2 px-4 rounded"
              >
                Add Position
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddPositionForm;
