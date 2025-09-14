import Modal from '../common/Modal';
import { CURRENCIES } from '../../utils/constants';

const PriceHistoryModal = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (currency) => {
    switch (currency) {
      case CURRENCIES.CHAOS: return 'Chaos Orb';
      case CURRENCIES.DIVINE: return 'Divine Orb';
      case CURRENCIES.EXALTED: return 'Exalted Orb';
      default: return currency;
    }
  };

  const getPriceChangeIcon = (current, previous) => {
    if (!previous) return '🆕'; // First price
    if (current.amount > previous.amount) return '📈'; // Increased
    if (current.amount < previous.amount) return '📉'; // Decreased
    return '🔄'; // Currency changed but same amount
  };

  const getPriceChangeColor = (current, previous) => {
    if (!previous) return 'text-blue-400'; // First price
    if (current.amount > previous.amount) return 'text-red-400'; // Increased (bad for sales)
    if (current.amount < previous.amount) return 'text-green-400'; // Decreased (good for sales)
    return 'text-yellow-400'; // Currency changed
  };

  const priceHistory = item.priceHistory || [];
  const totalChanges = priceHistory.length - 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Price History - ${item.name}`} size="md">
      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{totalChanges}</p>
              <p className="text-sm text-gray-400">Price Changes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {item.price?.amount || 0} {item.price?.currency?.toUpperCase() || 'C'}
              </p>
              <p className="text-sm text-gray-400">Current Price</p>
            </div>
          </div>
        </div>

        {/* Price History List */}
        {priceHistory.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {priceHistory.map((historyEntry, index) => {
              const isLatest = index === priceHistory.length - 1;
              const previousEntry = index > 0 ? priceHistory[index - 1] : null;
              
              return (
                <div 
                  key={historyEntry.id || index}
                  className={`
                    p-4 rounded-lg border transition-colors
                    ${isLatest 
                      ? 'bg-orange-900/30 border-orange-700' 
                      : 'bg-gray-700 border-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {getPriceChangeIcon(historyEntry.price, previousEntry?.price)}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-white">
                            {historyEntry.price.amount} {formatCurrency(historyEntry.price.currency)}
                          </span>
                          {isLatest && (
                            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          {formatDate(historyEntry.date)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Price Change Indicator */}
                    {previousEntry && (
                      <div className={`text-sm ${getPriceChangeColor(historyEntry.price, previousEntry.price)}`}>
                        {historyEntry.price.amount > previousEntry.price.amount ? '+' : ''}
                        {(historyEntry.price.amount - previousEntry.price.amount).toFixed(2)}
                        {historyEntry.price.currency !== previousEntry.price.currency && (
                          <div className="text-xs text-gray-400">
                            Currency: {formatCurrency(previousEntry.price.currency)} → {formatCurrency(historyEntry.price.currency)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* First price note */}
                  {index === 0 && (
                    <div className="mt-2 text-xs text-blue-300">
                      💡 Initial listing price
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No price history available</p>
          </div>
        )}

        {/* Insights */}
        {totalChanges > 0 && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-300 mb-2">💡 Pricing Insights</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              {totalChanges === 1 && (
                <li>• You've adjusted the price once - that's normal for finding the right market value</li>
              )}
              {totalChanges >= 2 && totalChanges <= 5 && (
                <li>• {totalChanges} price changes suggest you're fine-tuning to find the sweet spot</li>
              )}
              {totalChanges > 5 && (
                <li>• {totalChanges} price changes - consider researching similar items for better initial pricing</li>
              )}
              <li>• Price reductions often lead to faster sales</li>
            </ul>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PriceHistoryModal;