import React, { useState, useEffect } from 'react';
import { usePoEItems } from '../../hooks/useLocalStorage';
import ItemTooltip from './ItemTooltip';
import { Edit2, Trash2, DollarSign, Calendar, Clock, CheckCircle, Eye } from 'lucide-react';

const ItemCard = ({ item, showActions = false, showProfit = false }) => {
  const { updateItem, deleteItem, markAsSold } = usePoEItems();
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [actualPrice, setActualPrice] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [itemImage, setItemImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const profit = showProfit && item.actualPrice ? item.actualPrice - item.expectedPrice : 0;
  const daysListed = Math.ceil((new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24));
  const daysSold = showProfit && item.soldAt ? 
    Math.ceil((new Date(item.soldAt) - new Date(item.createdAt)) / (1000 * 60 * 60 * 24)) : 0;

  // Extract item base type and rarity for image fetching
  const extractItemInfo = (description) => {
    if (!description) return null;
    
    const lines = description.split('\n').map(line => line.trim());
    let rarity = 'Normal';
    let basetype = '';
    let itemName = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('Rarity:')) {
        rarity = line.replace('Rarity:', '').trim();
      } else if (line && !line.includes(':') && !line.includes('-') && itemName === '') {
        itemName = line;
      } else if (line && !line.includes(':') && !line.includes('-') && basetype === '' && itemName !== '') {
        basetype = line;
        break;
      }
    }
    
    return { rarity, basetype: basetype || itemName, itemName };
  };

  // Simple function to generate PoE Wiki image URL
  const getPoEWikiImageUrl = (basetype) => {
    if (!basetype) return null;
    // This is a simplified approach - PoE Wiki uses specific naming conventions
    const cleanName = basetype.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    return `https://pathofexile.fandom.com/wiki/Special:FilePath/${cleanName}_inventory_icon.png`;
  };

  // Fetch item image on component mount
  useEffect(() => {
    const itemInfo = extractItemInfo(item.description);
    if (itemInfo?.basetype && !itemImage) {
      setImageLoading(true);
      const imageUrl = getPoEWikiImageUrl(itemInfo.basetype);
      
      if (imageUrl) {
        const img = new Image();
        img.onload = () => {
          setItemImage(imageUrl);
          setImageLoading(false);
        };
        img.onerror = () => {
          setImageLoading(false);
          // Could try alternative image sources here
        };
        img.src = imageUrl;
      } else {
        setImageLoading(false);
      }
    }
  }, [item.description, itemImage]);

  const handleMarkAsSold = (e) => {
    e.preventDefault();
    if (!actualPrice || isNaN(parseFloat(actualPrice))) {
      alert('Please enter a valid sale price');
      return;
    }
    markAsSold(item.id, actualPrice);
    setShowSoldModal(false);
    setActualPrice('');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItem(item.id);
    }
  };

  const SoldModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold text-white mb-4">Mark as Sold</h3>
        <p className="text-slate-300 mb-4">
          Enter the actual sale price for <strong>{item.name}</strong>
        </p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Actual Sale Price (Divine Orbs)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              value={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 pr-12 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
              autoFocus
            />
            <span className="absolute right-4 top-3 text-amber-400 font-bold">♦</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Expected: {item.expectedPrice}♦
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleMarkAsSold}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            Confirm Sale
          </button>
          <button
            onClick={() => setShowSoldModal(false)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:bg-slate-800/70 transition-all duration-200">
        {/* Image or Tooltip Display */}
        <div className="aspect-video bg-slate-900/50 flex items-center justify-center p-3 relative">
          {showTooltip && item.description ? (
            <div className="flex items-center justify-center w-full h-full overflow-auto">
              <ItemTooltip itemText={item.description} className="transform scale-75 origin-center" />
            </div>
          ) : itemImage ? (
            <img
              src={itemImage}
              alt={item.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={() => setItemImage(null)} // Remove broken images
            />
          ) : imageLoading ? (
            <div className="text-slate-500 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Loading image...</p>
            </div>
          ) : (
            <div className="text-slate-500 text-center">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm">No image available</p>
            </div>
          )}
          
          {/* Toggle button for items with tooltip data */}
          {item.description && (
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              className="absolute top-2 right-2 p-1 bg-slate-800/80 hover:bg-slate-700 text-white rounded transition-colors"
              title={showTooltip ? "Show image" : "Show tooltip"}
            >
              <Eye size={14} />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-white text-lg truncate pr-2">
              {item.name}
            </h3>
            {item.status === 'sold' && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium shrink-0">
                <CheckCircle size={12} />
                Sold
              </span>
            )}
          </div>

          {/* Description/Stats - Show only first few lines */}
          {item.description && (
            <div className="mb-4">
              <div className="text-sm text-slate-300 bg-slate-900/30 rounded-lg p-3 font-mono text-xs leading-relaxed">
                {item.description.split('\n').slice(0, 3).map((line, index) => (
                  <div key={index} className="truncate">
                    {line.trim() || '\u00A0'}
                  </div>
                ))}
                {item.description.split('\n').length > 3 && (
                  <div className="text-slate-500 text-center mt-1">...</div>
                )}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Expected Price</span>
              {getCurrencyDisplay(item.currency || 'divine', item.expectedPrice)}
            </div>
            
            {showProfit && item.actualPrice && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Actual Price</span>
                  {getCurrencyDisplay(item.actualCurrency || item.currency || 'divine', item.actualPrice)}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <span className="text-slate-300 font-medium">Profit</span>
                  <span className={`font-bold flex items-center gap-1 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profit >= 0 ? '+' : ''}{profit.toFixed(1)}
                    <img 
                      src={getCurrency(item.actualCurrency || item.currency || 'divine').image}
                      alt="currency"
                      style={{ width: '16px', height: '16px' }}
                      className="inline-block"
                    />
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Timing Info */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {showProfit && item.soldAt ? `${daysSold}d to sell` : `${daysListed}d listed`}
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="mb-4">
              <p className="text-sm text-slate-400 italic bg-slate-700/30 rounded p-2">
                {item.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          {showActions && item.status === 'active' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowSoldModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors font-medium flex-1 justify-center"
              >
                <DollarSign size={12} />
                Mark Sold
              </button>
              <button
                onClick={() => {/* TODO: Implement edit */}}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showSoldModal && <SoldModal />}
    </>
  );
};

export default ItemCard;