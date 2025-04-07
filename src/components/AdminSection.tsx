import React, { useState } from 'react';

interface AdminSectionProps {
  onChangeBenchmark: (symbol: string) => void;
  onUpdatePrices: () => void;
  onClearPortfolio: () => void;
  currentBenchmark: string;
}

const AdminSection: React.FC<AdminSectionProps> = ({
  onChangeBenchmark,
  onUpdatePrices,
  onClearPortfolio,
  currentBenchmark
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [benchmarkSymbol, setBenchmarkSymbol] = useState(currentBenchmark);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Admin') {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleChangeBenchmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (benchmarkSymbol.trim()) {
      onChangeBenchmark(benchmarkSymbol.toUpperCase());
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">Admin Access</h3>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            className="bg-uww-purple hover:bg-purple-700 text-uww-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Admin Panel</h3>
        <button
          onClick={handleLogout}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-3 rounded text-sm"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Change Benchmark Symbol</h4>
          <form onSubmit={handleChangeBenchmark} className="flex space-x-2">
            <input
              type="text"
              value={benchmarkSymbol}
              onChange={(e) => setBenchmarkSymbol(e.target.value)}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="SPY"
            />
            <button
              type="submit"
              className="bg-uww-purple hover:bg-purple-700 text-uww-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
          </form>
        </div>

        <div>
          <h4 className="font-medium mb-2">Update Prices</h4>
          <button
            onClick={onUpdatePrices}
            className="bg-uww-purple hover:bg-purple-700 text-uww-white font-bold py-2 px-4 rounded w-full"
          >
            Fetch Latest Prices
          </button>
          <p className="text-sm text-gray-600 mt-1">
            This will update prices for all positions in your portfolio.
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Clear Portfolio Data</h4>
          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Clear All Portfolio Data
            </button>
          ) : (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
              <p className="mb-2">Are you sure? This cannot be undone.</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onClearPortfolio();
                    setShowConfirmClear(false);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Yes, Clear All Data
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-3 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
