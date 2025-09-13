import React, { useState } from 'react';
import { X, DollarSign, Clock, TrendingDown, TrendingUp, Save } from 'lucide-react';
import { getCurrency } from '../../constants/currencies';

const PriceHistoryModal = ({ show, item, onUpdatePrice, onClose }) => {
  const [newPrice, setNewPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!newPrice || isNaN(parseFloat(newPrice)) || parseFloat(newPrice) <= 0) {
      setError('Please enter a valid price greater than 0');
      return;
    }

    const price = parseFloat(newPrice);
    if (price === item.expectedPrice) {
      setError('New price must be different from current price');
      return;
    }

    onUpdatePrice(item.id, price);
    setNewPrice('');
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPriceChange = (currentPrice, previousPrice) => {
    if (!previousPrice) return null;
    const change = currentPrice - previousPrice;
    const percentChange = ((change / previousPrice) * 100).toFixed(1);
    return { change, percentChange };
  };

  if (!show || !item) return null;

  const priceHistory = item.priceHistory || [];
  const currency = getCurrency(item.currency || 'divine');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-amber-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/20 rounded-lg">
              <DollarSign size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Price History</h3>
              <p className="text-slate-400 text-sm">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Price */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Current Price</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xl">{item.expectedPrice}</span>
              <img 
                src={currency.image}
                alt={currency.name}
                className="w-6 h-6"
              />
            </div>
          </div>
        </div>

        {/* Price History */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Clock size={16} />
            Price History
          </h4>
          
          {priceHistory.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {priceHistory.map((entry, index) => {
                const previousEntry = priceHistory[index + 1];
                const change = getPriceChange(entry.price, previousEntry?.price);
                
                return (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400 text-sm">
                        {formatDate(entry.changedAt)}
                      </div>
                      {change && (
                        <div className={`flex items-center gap-1 text-xs ${
                          change.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {change.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {change.change > 0 ? '+' : ''}{change.change.toFixed(1)} ({change.percentChange}%)
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{entry.price}</span>
                      <img 
                        src={currency.image}
                        alt={currency.name}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-500 text-center py-4">
              <Clock size={32} className="mx-auto mb-2 text-slate-600" />
              <p>No price changes yet</p>
            </div>
          )}
        </div>

        {/* Update Price Form */}
        <div className="border-t border-slate-700 pt-6">
          <h4 className="text-white font-medium mb-3">Update Price</h4>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder={`Current: ${item.expectedPrice}`}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-3 bg-slate-700/30 border border-slate-600 rounded-lg">
                <img 
                  src={currency.image}
                  alt={currency.name}
                  className="w-5 h-5"
                />
                <span className="text-slate-300 text-sm">{currency.name}</span>
              </div>
            </div>
            
            {error && (
              <div className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium flex-1 justify-center"
              >
                <Save size={16} />
                Update Price
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryModal;