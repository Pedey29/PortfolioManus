import React, { useState } from 'react';
import { StockPosition } from '../types/types';
import { useAuth } from '../hooks/useAuth';

interface PositionListProps {
  positions: StockPosition[];
  onRemovePosition: (id: string) => void;
  isLoading: boolean;
}

const PositionList: React.FC<PositionListProps> = ({ positions, onRemovePosition, isLoading }) => {
  const { isAdmin } = useAuth();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StockPosition;
    direction: 'ascending' | 'descending';
  }>({
    key: 'symbol',
    direction: 'ascending',
  });

  const sortedPositions = React.useMemo(() => {
    const sortablePositions = [...positions];
    if (sortConfig.key) {
      sortablePositions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePositions;
  }, [positions, sortConfig]);

  const requestSort = (key: keyof StockPosition) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading positions...</div>;
  }

  if (positions.length === 0) {
    return <div className="text-center py-4">No positions in portfolio. Add your first position above.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-uww-purple text-uww-white">
          <tr>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('symbol')}
            >
              Symbol {getClassNamesFor('symbol') === 'ascending' ? '↑' : getClassNamesFor('symbol') === 'descending' ? '↓' : ''}
            </th>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('companyName')}
            >
              Name {getClassNamesFor('companyName') === 'ascending' ? '↑' : getClassNamesFor('companyName') === 'descending' ? '↓' : ''}
            </th>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('currentPrice')}
            >
              Current Price {getClassNamesFor('currentPrice') === 'ascending' ? '↑' : getClassNamesFor('currentPrice') === 'descending' ? '↓' : ''}
            </th>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('shares')}
            >
              Shares {getClassNamesFor('shares') === 'ascending' ? '↑' : getClassNamesFor('shares') === 'descending' ? '↓' : ''}
            </th>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('currentValue')}
            >
              Current Value {getClassNamesFor('currentValue') === 'ascending' ? '↑' : getClassNamesFor('currentValue') === 'descending' ? '↓' : ''}
            </th>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('weight')}
            >
              Weight % {getClassNamesFor('weight') === 'ascending' ? '↑' : getClassNamesFor('weight') === 'descending' ? '↓' : ''}
            </th>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('weeklyChange')}
            >
              Weekly Change % {getClassNamesFor('weeklyChange') === 'ascending' ? '↑' : getClassNamesFor('weeklyChange') === 'descending' ? '↓' : ''}
            </th>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('totalReturn')}
            >
              Total Return % {getClassNamesFor('totalReturn') === 'ascending' ? '↑' : getClassNamesFor('totalReturn') === 'descending' ? '↓' : ''}
            </th>
            <th 
              className="py-2 px-4 cursor-pointer"
              onClick={() => requestSort('sector')}
            >
              Sector {getClassNamesFor('sector') === 'ascending' ? '↑' : getClassNamesFor('sector') === 'descending' ? '↓' : ''}
            </th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPositions.map((position) => (
            <tr key={position.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4 font-medium">{position.symbol}</td>
              <td className="py-2 px-4">{position.companyName}</td>
              <td className="py-2 px-4">${position.currentPrice.toFixed(2)}</td>
              <td className="py-2 px-4">{position.shares}</td>
              <td className="py-2 px-4">${position.currentValue.toFixed(2)}</td>
              <td className="py-2 px-4">{position.weight.toFixed(2)}%</td>
              <td className={`py-2 px-4 ${position.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {position.weeklyChange.toFixed(2)}%
              </td>
              <td className={`py-2 px-4 ${position.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {position.totalReturn.toFixed(2)}%
              </td>
              <td className="py-2 px-4">{position.sector}</td>
              <td className="py-2 px-4">
                {isAdmin ? (
                  <button
                    onClick={() => onRemovePosition(position.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="bg-gray-300 text-gray-500 font-bold py-1 px-2 rounded text-sm cursor-not-allowed"
                    disabled
                    title="Admin access required"
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionList;
